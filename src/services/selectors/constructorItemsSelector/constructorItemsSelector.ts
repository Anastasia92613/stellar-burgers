import { RootState } from '../../store';

export const constructorItemsSelector = (state: RootState) =>
  state.constructorItems;
export const constructorItemsBunSelector = (state: RootState) =>
  state.constructorItems.bun;
export const constructorItemsIngredientsSelector = (state: RootState) =>
  state.constructorItems.ingredients;
