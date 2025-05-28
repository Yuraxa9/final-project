/// <reference types="cypress" />

// API URL и селекторы ингредиентов
const API_URL = 'https://norma.nomoreparties.space/api';
const FLUOR_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`; // Флюоресцентная булка R2-D3
const CRATER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`; // Краторная булка N-200i
const SAUCE_SPICY = `[data-cy=${'643d69a5c3f7b9001cfa0942'}]`; // Соус Spicy-X
const MINERAL_RINGS = `[data-cy=${'643d69a5c3f7b9001cfa0946'}]`; // Хрустящие минеральные кольца
const CHEESE = `[data-cy=${'643d69a5c3f7b9001cfa094a'}]`; // Сыр с астероидной плесенью
const SAUCE_SPACE = `[data-cy=${'643d69a5c3f7b9001cfa0943'}]`; // Соус фирменный Space Sauce
const SALAD = `[data-cy=${'643d69a5c3f7b9001cfa0949'}]`; // Мини-салат Экзо-Плантаго

// Общая настройка перед каждым тестом
beforeEach(() => {
  // Перехватываем запросы к API
  cy.intercept('GET', `${API_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('GET', `${API_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  
  // Открываем страницу и настраиваем окно просмотра
  cy.visit('/');
  cy.viewport(1280, 900);
  cy.get('#modals').as('modalContainer');
});

// Тесты для модальных окон
describe('Взаимодействие с модальными окнами', () => {
  it('Должен открывать модальное окно при клике на ингредиент', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(CHEESE).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa094a');
  });

  it('Должен закрывать модальное окно при нажатии клавиши Escape', () => {
    cy.get(SAUCE_SPICY).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });

  it('Должен закрывать модальное окно при клике на крестик', () => {
    cy.get(MINERAL_RINGS).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('Должен отображать правильные данные в модальном окне ингредиента', () => {
    cy.get(CHEESE).children('a').click();
    cy.get('@modalContainer').contains('Детали ингредиента');
    cy.get('@modalContainer').contains('Сыр с астероидной плесенью');
  });
});

// Тесты для манипуляций с ингредиентами
describe('Конструктор бургера: манипуляции с ингредиентами', () => {
  describe('Добавление ингредиентов в конструктор', () => {
    it('Должен увеличивать счетчик при добавлении ингредиента', () => {
      cy.get(SAUCE_SPICY).children('button').click();
      cy.get(SAUCE_SPICY).find('.counter__num').contains('1');
    });

    it('Должен добавлять несколько разных ингредиентов', () => {
      cy.get(FLUOR_BUN).children('button').click();
      cy.get(SAUCE_SPICY).children('button').click();
      cy.get(CHEESE).children('button').click();
      
      cy.get(SAUCE_SPICY).find('.counter__num').contains('1');
      cy.get(CHEESE).find('.counter__num').contains('1');
    });
  });

  describe('Замена булок в конструкторе', () => {
    it('Должен заменять булку на другую', () => {
      cy.get(FLUOR_BUN).children('button').click();
      cy.get(FLUOR_BUN).find('.counter__num').contains('2');
      
      cy.get(CRATER_BUN).children('button').click();
      
      cy.get(FLUOR_BUN).find('.counter__num').should('not.exist');
      cy.get(CRATER_BUN).find('.counter__num').contains('2');
    });
  });
});

// Тесты для оформления заказа
describe('Оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');
  });
  
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });
  
  it('Должен оформлять заказ с проверкой номера заказа', () => {
    cy.get(FLUOR_BUN).children('button').click();
    cy.get(SAUCE_SPICY).children('button').click();
    cy.get(CHEESE).children('button').click();
    
    cy.get(`[data-cy='order-button']`).click();
    
    cy.get('@modalContainer').find('h2').contains('38483');
  });
});

// Тесты для проверки авторизации
describe('Авторизация и права доступа', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/auth/user`, {
      statusCode: 401,
      body: {
        success: false,
        message: 'jwt expired'
      }
    });
  });

  it('Должен перенаправлять на страницу логина при попытке доступа к профилю без авторизации', () => {
    cy.visit('/profile');
    cy.url().should('include', '/login');
  });

  it('Должен разрешать доступ к ленте заказов без авторизации', () => {
    cy.visit('/feed');
    cy.url().should('include', '/feed');
    cy.contains('Лента заказов').should('exist');
  });
});

// Тест для проверки доступности страницы профиля
describe('Навигация по приложению', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');
  });
  
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });
  
  it('Должен иметь доступ к странице профиля при авторизации', () => {
    cy.visit('/profile');
    cy.url().should('include', '/profile');
    cy.contains('Профиль').should('exist');
  });
  
  it('Должен иметь доступ к странице ленты заказов', () => {
    cy.visit('/feed');
    cy.url().should('include', '/feed');
    cy.contains('Лента заказов').should('exist');
  });
});

// Дополнительные тесты профиля
describe('Дополнительные тесты профиля', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });

  it('Должен отображать форму профиля', () => {
    cy.visit('/profile');
    cy.get('form').should('exist');
  });

  it('Должен отображать поля ввода в форме профиля', () => {
    cy.visit('/profile');
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
  });
});

// Новые простые тесты
describe('Базовые проверки приложения', () => {
  it('Должен отображать заголовок страницы', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
  });

  it('Должен отображать список ингредиентов', () => {
    cy.visit('/');
    cy.get(CHEESE).should('exist');
    cy.get(SAUCE_SPICY).should('exist');
    cy.get(FLUOR_BUN).should('exist');
  });

  it('Должен отображать кнопку оформления заказа', () => {
    cy.visit('/');
    cy.get(`[data-cy='order-button']`).should('exist');
  });
});

// Тесты для проверки навигации
describe('Проверка навигации', () => {
  it('Должен переходить на страницу ленты заказов', () => {
    cy.visit('/feed');
    cy.url().should('include', '/feed');
  });

  it('Должен переходить на страницу профиля', () => {
    cy.visit('/profile');
    cy.url().should('include', '/profile');
  });
});

// Тесты для проверки ингредиентов
describe('Проверка ингредиентов', () => {
  it('Должен отображать изображения ингредиентов', () => {
    cy.visit('/');
    cy.get(CHEESE).find('img').should('exist');
    cy.get(SAUCE_SPICY).find('img').should('exist');
  });

  it('Должен отображать названия ингредиентов', () => {
    cy.visit('/');
    cy.get(CHEESE).contains('Сыр').should('exist');
    cy.get(SAUCE_SPICY).contains('Соус').should('exist');
  });
});

// Дополнительные простые тесты
describe('Дополнительные проверки интерфейса', () => {
  it('Должен отображать секцию с булками', () => {
    cy.visit('/');
    cy.contains('Булки').should('exist');
  });

  it('Должен отображать секцию с соусами', () => {
    cy.visit('/');
    cy.contains('Соусы').should('exist');
  });

  it('Должен отображать секцию с начинками', () => {
    cy.visit('/');
    cy.contains('Начинки').should('exist');
  });
});

describe('Проверка модальных окон', () => {
  it('Должен отображать модальное окно при клике на ингредиент', () => {
    cy.visit('/');
    cy.get(CHEESE).click();
    cy.get('#modals').should('not.be.empty');
  });

  it('Должен отображать кнопку закрытия в модальном окне', () => {
    cy.visit('/');
    cy.get(CHEESE).click();
    cy.get('#modals').find('button').should('exist');
  });
});

describe('Проверка навигации по приложению', () => {
  it('Должен отображать логотип', () => {
    cy.visit('/');
    cy.get('header').find('a').first().should('exist');
  });

  it('Должен отображать кнопку профиля', () => {
    cy.visit('/');
    cy.get('header').contains('Личный кабинет').should('exist');
  });
}); 