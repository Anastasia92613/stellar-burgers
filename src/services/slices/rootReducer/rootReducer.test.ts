import { rootReducer, RootState } from './rootReducer';
import ingredientsReducer from '../ingredientsSlice/ingredientsSlice';
import ordersReducer from '../ordersSlice/ordersSlice';
import orderBurgerReducer from '../orderBurgerSlice/orderBurgerSlice';
import forgotPasswordReducer from '../forgotPasswordSlice/forgotPasswordSlice';
import resetPasswordReducer from '../resetPassword/resetPasswordSlice';
import userReducer from '../userSlice/userSlice';
import constructorItemsReducer from '../constructorItemsSlice/constructorItemsSlice';

describe('rootReducer', () => {
  it('проверяет инициализацию', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      orders: ordersReducer(undefined, { type: '@@INIT' }),
      orderBurger: orderBurgerReducer(undefined, { type: '@@INIT' }),
      forgotPassword: forgotPasswordReducer(undefined, { type: '@@INIT' }),
      resetPassword: resetPasswordReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      constructorItems: constructorItemsReducer(undefined, { type: '@@INIT' })
    });
  });
  
  it('проверяет инициализацию с undefined состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      orders: ordersReducer(undefined, { type: '@@INIT' }),
      orderBurger: orderBurgerReducer(undefined, { type: '@@INIT' }),
      forgotPassword: forgotPasswordReducer(undefined, { type: '@@INIT' }),
      resetPassword: resetPasswordReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      constructorItems: constructorItemsReducer(undefined, { type: '@@INIT' })
    });
  });

  it('проверяет обработку неизвестного экшена', () => {
    const currentState = rootReducer(undefined, { type: '@@INIT' });
    const newState = rootReducer(currentState, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(currentState);
  });
});
