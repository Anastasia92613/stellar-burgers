import { RootState } from '../../store';

// Базовый селектор для получения всех ингридиентов
export const ingredientsSelectorAll = (state: RootState) => state.ingredients;

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const ingredientRequestSelector = (state: RootState) =>
  state.ingredients.getIngredientRequest;
