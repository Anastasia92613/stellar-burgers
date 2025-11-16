import { RootState } from '../../store';

export const orderBurgerRequestSelector = (state: RootState) =>
  state.orderBurger.orderBurgerRequest;
export const orderBurgerSelector = (state: RootState) =>
  state.orderBurger.orderModalData?.order;
export const orderBurgerSuccessSelector = (state: RootState) =>
  state.orderBurger.success;
