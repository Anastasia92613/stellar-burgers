import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  getUserOrders,
  orderByNumber,
  getFeeds
} from './ordersSlice';

describe('тестирует редьюсер ordersSlice', () => {
  // Моковые данные для переиспользования
  const mockOrder = {
    _id: 'order-1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'created',
    name: 'Space burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345
  };

  const mockUserOrders = [mockOrder];
  const mockOrder2 = { ...mockOrder, _id: 'order-2', number: 12346 };

  const mockOrderByNumberResponse = {
    success: true,
    orders: [mockOrder]
  };

  const mockFeedsResponse = {
    success: true,
    orders: [mockOrder, mockOrder2],
    total: 100,
    totalToday: 10
  };

  const mockErrorResponse = { success: false, message: 'Ошибка' };
  const mockOrderNotFoundResponse = {
    success: false,
    message: 'Заказ не найден'
  };
  const mockFeedsErrorResponse = {
    success: false,
    message: 'Ошибка получения заказов'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешный getUserOrders', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, orders: mockUserOrders })
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    const initialState = store.getState().orders;
    expect(initialState.ordersRequest).toBe(false);
    expect(initialState.ordersError).toBeNull();

    const dispatchPromise = store.dispatch(getUserOrders());

    const pendingState = store.getState().orders;
    expect(pendingState.ordersRequest).toBe(true);
    expect(pendingState.ordersError).toBeNull();

    await dispatchPromise;

    const fulfilledState = store.getState().orders;
    expect(fulfilledState.orders).toEqual(mockUserOrders);
    expect(fulfilledState.ordersRequest).toBe(false);
    expect(fulfilledState.ordersError).toBeNull();
  });

  test('тестирует неуспешный getUserOrders', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(getUserOrders());

    const rejectedState = store.getState().orders;
    expect(rejectedState.ordersRequest).toBe(false);
    expect(rejectedState.ordersError).not.toBeNull();
    expect(rejectedState.orders).toEqual([]);
  });

  test('тестирует успешный orderByNumber', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOrderByNumberResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    const orderNumber = 12345;
    const dispatchPromise = store.dispatch(orderByNumber(orderNumber));

    const pendingState = store.getState().orders;
    expect(pendingState.ordersRequest).toBe(true);
    expect(pendingState.ordersError).toBeNull();

    await dispatchPromise;

    const fulfilledState = store.getState().orders;
    expect(fulfilledState.ordersRequest).toBe(false);
    expect(fulfilledState.ordersError).toBeNull();
    expect(fulfilledState.orderByNumber).toEqual(
      mockOrderByNumberResponse.orders
    );
  });

  test('тестирует неуспешный orderByNumber', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOrderNotFoundResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(orderByNumber(99999));

    const rejectedState = store.getState().orders;
    expect(rejectedState.ordersRequest).toBe(false);
    expect(rejectedState.ordersError).not.toBeNull();
    expect(rejectedState.orderByNumber).toEqual([]);
  });

  test('тестирует успешный getFeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFeedsResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    const initialState = store.getState().orders;
    expect(initialState.ordersFeed).toEqual([]);
    expect(initialState.totalFeed).toBe(0);
    expect(initialState.totalTodayFeed).toBe(0);

    const dispatchPromise = store.dispatch(getFeeds());

    const pendingState = store.getState().orders;
    expect(pendingState.ordersRequest).toBe(true);
    expect(pendingState.ordersError).toBeNull();

    await dispatchPromise;

    const fulfilledState = store.getState().orders;
    expect(fulfilledState.ordersRequest).toBe(false);
    expect(fulfilledState.ordersError).toBeNull();
    expect(fulfilledState.ordersFeed).toEqual(mockFeedsResponse.orders);
    expect(fulfilledState.totalFeed).toBe(mockFeedsResponse.total);
    expect(fulfilledState.totalTodayFeed).toBe(mockFeedsResponse.totalToday);
  });

  test('тестирует неуспешный getFeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFeedsErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersReducer }
    });

    await store.dispatch(getFeeds());

    const rejectedState = store.getState().orders;
    expect(rejectedState.ordersRequest).toBe(false);
    expect(rejectedState.ordersError).not.toBeNull();
    expect(rejectedState.ordersFeed).toEqual([]);
    expect(rejectedState.totalFeed).toBe(0);
    expect(rejectedState.totalTodayFeed).toBe(0);
  });
});
