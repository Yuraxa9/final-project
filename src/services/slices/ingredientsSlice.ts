import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../types/types';

interface IIngredientsState {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  data: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    fetchIngredients: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIngredientsSuccess: (state, action: PayloadAction<TIngredient[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchIngredientsFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    incrementCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.data.find(item => item._id === action.payload);
      if (ingredient) {
        ingredient.count = (ingredient.count || 0) + 1;
      }
    },
    decrementCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.data.find(item => item._id === action.payload);
      if (ingredient && ingredient.count && ingredient.count > 0) {
        ingredient.count -= 1;
      }
    },
    clearCount: (state) => {
      state.data.forEach(item => {
        item.count = 0;
      });
    }
  }
});

export const {
  fetchIngredients,
  fetchIngredientsSuccess,
  fetchIngredientsFailed,
  incrementCount,
  decrementCount,
  clearCount
} = ingredientsSlice.actions;

export const ingredientsReducer = ingredientsSlice.reducer; 