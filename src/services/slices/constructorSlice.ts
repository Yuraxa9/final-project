import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../types/types';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  total: number;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  total: 0
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
      state.total = calculateTotal(state.bun, state.ingredients);
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
      state.total = calculateTotal(state.bun, state.ingredients);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(item => item.id !== action.payload);
      state.total = calculateTotal(state.bun, state.ingredients);
    },
    moveIngredient: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.total = 0;
    }
  }
});

const calculateTotal = (bun: TConstructorIngredient | null, ingredients: TConstructorIngredient[]): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
  return bunPrice + ingredientsPrice;
};

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer; 