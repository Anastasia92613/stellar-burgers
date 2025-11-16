import { configureStore } from '@reduxjs/toolkit';
import orderBurgerReducer, {
  orderBurger,
  clearOrder
} from './orderBurgerSlice';

describe('тестирует редьюсер orderBurgerSlice', () => {
  const mockOrder = {
    _id: '123',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'created',
    name: 'Space burger',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345
  };

  const mockSuccessResponse = {
    success: true,
    order: mockOrder,
    name: 'Space burger'
  };

  const mockErrorResponse = {
    success: false,
    message: 'Ошибка создания заказа'
  };

  const mockIngredients = ['ingredient1', 'ingredient2'];
  const mockSingleIngredient = ['ingredient1'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешный orderBurger', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { orderBurger: orderBurgerReducer }
    });

    const initialState = store.getState().orderBurger;
    expect(initialState.orderBurgerRequest).toBe(false);
    expect(initialState.orderBurgerError).toBeNull();
    expect(initialState.orderModalData).toBeNull();
    expect(initialState.success).toBe(false);

    const dispatchPromise = store.dispatch(orderBurger(mockIngredients));

    const pendingState = store.getState().orderBurger;
    expect(pendingState.orderBurgerRequest).toBe(true);
    expect(pendingState.orderBurgerError).toBeNull();
    expect(pendingState.orderModalData).toBeNull();
    expect(pendingState.success).toBe(false);

    await dispatchPromise;

    const fulfilledState = store.getState().orderBurger;
    expect(fulfilledState.orderBurgerRequest).toBe(false);
    expect(fulfilledState.orderBurgerError).toBeNull();
    expect(fulfilledState.orderModalData).toEqual(mockSuccessResponse);
    expect(fulfilledState.success).toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json;charset=utf-8',
          authorization: 'mock-token'
        }),
        body: JSON.stringify({ ingredients: mockIngredients })
      })
    );
  });

  test('тестирует неуспешный orderBurger', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { orderBurger: orderBurgerReducer }
    });

    await store.dispatch(orderBurger(mockIngredients));

    const rejectedState = store.getState().orderBurger;

    expect(rejectedState.orderBurgerRequest).toBe(false);
    expect(rejectedState.orderModalData).toBeNull();
    expect(rejectedState.success).toBe(false);
    expect(rejectedState.orderBurgerError).not.toBeNull();
  });

  test('тестирует clearOrder', () => {
    const store = configureStore({
      reducer: { orderBurger: orderBurgerReducer }
    });

    store.dispatch({
      type: 'order/orderBurger/fulfilled',
      payload: mockSuccessResponse
    });

    const stateWithOrder = store.getState().orderBurger;
    expect(stateWithOrder.orderModalData).toEqual(mockSuccessResponse);
    expect(stateWithOrder.orderBurgerError).toBeNull();

    store.dispatch(clearOrder());

    const clearedState = store.getState().orderBurger;
    expect(clearedState.orderModalData).toBeNull();
    expect(clearedState.orderBurgerError).toBeNull();
    expect(clearedState.orderBurgerRequest).toBe(false);
  });

  test('тестирует clearOrder когда есть ошибка', () => {
    const store = configureStore({
      reducer: { orderBurger: orderBurgerReducer }
    });

    store.dispatch({
      type: 'order/orderBurger/rejected',
      payload: mockErrorResponse
    });

    const stateWithError = store.getState().orderBurger;
    expect(stateWithError.orderBurgerError).toEqual(mockErrorResponse);

    store.dispatch(clearOrder());

    const clearedState = store.getState().orderBurger;
    expect(clearedState.orderModalData).toBeNull();
    expect(clearedState.orderBurgerError).toBeNull();
    expect(clearedState.orderBurgerRequest).toBe(false);
  });

  test('тестирует orderBurger без токена авторизации', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue(null);

    const store = configureStore({
      reducer: { orderBurger: orderBurgerReducer }
    });

    await store.dispatch(orderBurger(mockSingleIngredient));

    const rejectedState = store.getState().orderBurger;
    expect(rejectedState.orderBurgerRequest).toBe(false);
    expect(rejectedState.orderBurgerError).not.toBeNull();
    expect(rejectedState.orderModalData).toBeNull();

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          authorization: expect.any(String)
        })
      })
    );
  });
});
