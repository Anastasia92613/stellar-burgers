import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';
import orderBurgerReducer from './slices/orderBurgerSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';
import resetPasswordReducer from './slices/resetPasswordSlice';
import userReducer from './slices/userSlice';
import constructorItemsReducer from './slices/constructorItemsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  orderBurger: orderBurgerReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  user: userReducer,
  constructorItems: constructorItemsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
