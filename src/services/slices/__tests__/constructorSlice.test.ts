import { constructorReducer, addBun, addIngredient, removeIngredient, moveIngredient, clearConstructor } from '../constructorSlice';
import { TConstructorIngredient } from '../../../types/types';

const mockBun: TConstructorIngredient = {
  id: '1',
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 200,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg',
  __v: 0
};

const mockIngredient: TConstructorIngredient = {
  id: '2',
  _id: '2',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 100,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg',
  __v: 0
};

describe('constructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    total: 0
  };

  it('should handle addBun', () => {
    const nextState = constructorReducer(initialState, addBun(mockBun));
    expect(nextState.bun).toEqual(mockBun);
    expect(nextState.total).toBe(400); // bun price * 2
  });

  it('should handle addIngredient', () => {
    const nextState = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(mockIngredient);
    expect(nextState.total).toBe(100); // ingredient price
  });

  it('should handle removeIngredient', () => {
    const state = {
      ...initialState,
      ingredients: [mockIngredient],
      total: 100
    };
    const nextState = constructorReducer(state, removeIngredient('2'));
    expect(nextState.ingredients).toHaveLength(0);
    expect(nextState.total).toBe(0);
  });

  it('should handle moveIngredient', () => {
    const ingredient1 = { ...mockIngredient, id: '2' };
    const ingredient2 = { ...mockIngredient, id: '3' };
    const state = {
      ...initialState,
      ingredients: [ingredient1, ingredient2],
      total: 200
    };
    const nextState = constructorReducer(state, moveIngredient({ dragIndex: 0, hoverIndex: 1 }));
    expect(nextState.ingredients[0]).toEqual(ingredient2);
    expect(nextState.ingredients[1]).toEqual(ingredient1);
  });

  it('should handle clearConstructor', () => {
    const state = {
      bun: mockBun,
      ingredients: [mockIngredient],
      total: 500
    };
    const nextState = constructorReducer(state, clearConstructor());
    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(0);
    expect(nextState.total).toBe(0);
  });

  it('should calculate total correctly with bun and ingredients', () => {
    const state = {
      bun: mockBun,
      ingredients: [mockIngredient],
      total: 0
    };
    const nextState = constructorReducer(state, addIngredient(mockIngredient));
    expect(nextState.total).toBe(600);
  });
}); 