import {
  ordersSelector,
  orderFeedsSelector,
  ordersRequestSelector,
  totalTodayFeedSelector,
  totalFeedSelector
} from './ordersSelector';

describe('тестирует селектор ordersSelector', () => {
  const mockOrder = {
    _id: 'order-1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'created',
    name: 'Space burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345
  };

  const mockOrder2 = {
    ...mockOrder,
    _id: 'order-2',
    number: 12346
  };

  test('тестирует получение ordersSelector', () => {
    const testState = {
      orders: {
        orders: [mockOrder, mockOrder2],
        ordersRequest: false,
        ordersError: null,
        ordersFeed: [],
        totalFeed: 0,
        totalTodayFeed: 0,
        orderByNumber: []
      }
    } as any;

    const orders = ordersSelector(testState);

    expect(orders).toEqual([mockOrder, mockOrder2]);
  });

  test('тестирует получение orderFeedsSelector', () => {
    const testState = {
      orders: {
        orders: [],
        ordersRequest: false,
        ordersError: null,
        ordersFeed: [mockOrder, mockOrder2],
        totalFeed: 100,
        totalTodayFeed: 10,
        orderByNumber: []
      }
    } as any;

    const ordersFeed = orderFeedsSelector(testState);

    expect(ordersFeed).toEqual([mockOrder, mockOrder2]);
  });

  test('тестирует получение ordersRequestSelector', () => {
    const testState = {
      orders: {
        orders: [],
        ordersRequest: true,
        ordersError: null,
        ordersFeed: [],
        totalFeed: 0,
        totalTodayFeed: 0,
        orderByNumber: []
      }
    } as any;

    const isRequesting = ordersRequestSelector(testState);

    expect(isRequesting).toBe(true);
  });

  test('тестирует получение totalTodayFeedSelector', () => {
    const testState = {
      orders: {
        orders: [],
        ordersRequest: false,
        ordersError: null,
        ordersFeed: [mockOrder, mockOrder2],
        totalFeed: 150,
        totalTodayFeed: 15,
        orderByNumber: []
      }
    } as any;

    const totalTodayFeed = totalTodayFeedSelector(testState);

    expect(totalTodayFeed).toBe(15);
  });

  test('тестирует получение totalFeedSelector', () => {
    const testState = {
      orders: {
        orders: [],
        ordersRequest: true,
        ordersError: null,
        ordersFeed: 0,
        totalFeed: 100,
        totalTodayFeed: 0,
        orderByNumber: []
      }
    } as any;

    const totalFeed = totalFeedSelector(testState);

    expect(totalFeed).toBe(100);
  });
});
