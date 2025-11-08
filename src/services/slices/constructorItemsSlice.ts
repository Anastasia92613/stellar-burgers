import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface TConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: TConstructorItems = {
  bun: null,
  ingredients: []
};

export const constructorItemsSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        } as TConstructorIngredient
      })
    },
    moveIngredient: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
      state.ingredients = ingredients;
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorItemsSlice.actions;
export default constructorItemsSlice.reducer;
