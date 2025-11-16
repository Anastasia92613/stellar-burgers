import {
  orderBurgerRequestSelector,
  orderBurgerSelector,
  orderBurgerSuccessSelector
} from './orderBurgerSelector';

describe('тестирует селектор orderBurger', () => {
  const mockOrder = {
    _id: '123',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'created',
    name: 'Space burger',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345
  };

  const mockOrderModalData = {
    success: true,
    order: mockOrder,
    name: 'Space burger'
  };

  test('тестирует получение orderBurgerRequestSelector', () => {
    const testState = {
      orderBurger: {
        orderBurgerRequest: true,
        orderBurgerError: null,
        orderModalData: null,
        success: false
      }
    } as any;

    const isRequesting = orderBurgerRequestSelector(testState);

    expect(isRequesting).toBe(true);
  });

  test('тестирует получение orderBurgerSelector', () => {
    const testState = {
      orderBurger: {
        orderBurgerRequest: false,
        orderBurgerError: null,
        orderModalData: mockOrderModalData,
        success: true
      }
    } as any;

    const order = orderBurgerSelector(testState);

    expect(order).toEqual(mockOrder);
  });

  test('тестирует получение orderBurgerSelector когда orderModalData null', () => {
    const testState = {
      orderBurger: {
        orderBurgerRequest: false,
        orderBurgerError: null,
        orderModalData: null,
        success: false
      }
    } as any;

    const order = orderBurgerSelector(testState);

    expect(order).toBeUndefined();
  });

  test('тестирует получение orderBurgerSuccessSelector', () => {
    const testState = {
      orderBurger: {
        orderBurgerRequest: false,
        orderBurgerError: null,
        orderModalData: mockOrderModalData,
        success: true
      }
    } as any;

    const isSuccess = orderBurgerSuccessSelector(testState);

    expect(isSuccess).toBe(true);
  });
});
