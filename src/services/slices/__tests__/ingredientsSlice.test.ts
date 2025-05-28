import { ingredientsReducer, fetchIngredients, fetchIngredientsSuccess, fetchIngredientsFailed, incrementCount, decrementCount, clearCount } from '../ingredientsSlice';
import { TIngredient } from '../../../types/types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 100,
  price: 200,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg',
  __v: 0,
  count: 0
};

describe('ingredients slice', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  it('should handle fetchIngredients', () => {
    const nextState = ingredientsReducer(initialState, fetchIngredients());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchIngredientsSuccess', () => {
    const ingredients = [mockIngredient];
    const nextState = ingredientsReducer(initialState, fetchIngredientsSuccess(ingredients));
    expect(nextState.data).toEqual(ingredients);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchIngredientsFailed', () => {
    const error = 'Failed to fetch ingredients';
    const nextState = ingredientsReducer(initialState, fetchIngredientsFailed(error));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it('should handle incrementCount', () => {
    const state = {
      ...initialState,
      data: [mockIngredient]
    };
    const nextState = ingredientsReducer(state, incrementCount('1'));
    expect(nextState.data[0].count).toBe(1);
  });

  it('should handle decrementCount', () => {
    const state = {
      ...initialState,
      data: [{ ...mockIngredient, count: 1 }]
    };
    const nextState = ingredientsReducer(state, decrementCount('1'));
    expect(nextState.data[0].count).toBe(0);
  });

  it('should not decrement count below 0', () => {
    const state = {
      ...initialState,
      data: [{ ...mockIngredient, count: 0 }]
    };
    const nextState = ingredientsReducer(state, decrementCount('1'));
    expect(nextState.data[0].count).toBe(0);
  });

  it('should handle clearCount', () => {
    const state = {
      ...initialState,
      data: [
        { ...mockIngredient, count: 2 },
        { ...mockIngredient, _id: '2', count: 3 }
      ]
    };
    const nextState = ingredientsReducer(state, clearCount());
    expect(nextState.data[0].count).toBe(0);
    expect(nextState.data[1].count).toBe(0);
  });
}); 