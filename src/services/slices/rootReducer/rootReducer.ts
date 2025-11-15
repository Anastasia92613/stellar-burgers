import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../ingredientsSlice/ingredientsSlice';
import ordersReducer from '../ordersSlice/ordersSlice';
import orderBurgerReducer from '../orderBurgerSlice/orderBurgerSlice';
import forgotPasswordReducer from '../forgotPasswordSlice/forgotPasswordSlice';
import resetPasswordReducer from '../resetPassword/resetPasswordSlice';
import userReducer from '../userSlice/userSlice';
import constructorItemsReducer from '../constructorItemsSlice/constructorItemsSlice';

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
