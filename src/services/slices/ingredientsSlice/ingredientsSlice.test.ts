import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { getIngredient } from './ingredientsSlice';

describe('тестирует редьюсер ingredientsSlice', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 200,
      image: 'image1.jpg',
      image_mobile: 'image1-mobile.jpg',
      image_large: 'image1-large.jpg'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      calories: 150,
      price: 150,
      image: 'image2.jpg',
      image_mobile: 'image2-mobile.jpg',
      image_large: 'image2-large.jpg'
    }
  ];

  const mockSuccessResponse = {
    success: true,
    data: mockIngredients
  };

  const mockErrorResponse = {
    success: false,
    data: mockIngredients
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешный getIngredient', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    const initialState = store.getState().ingredients;
    expect(initialState.getIngredientRequest).toBe(false);
    expect(initialState.getIngredientError).toBeNull();
    expect(initialState.ingredients).toEqual([]);

    const dispatchPromise = store.dispatch(getIngredient());

    const pendingState = store.getState().ingredients;
    expect(pendingState.getIngredientRequest).toBe(true);
    expect(pendingState.getIngredientError).toBeNull();
    expect(pendingState.ingredients).toEqual([]);

    await dispatchPromise;

    const fulfilledState = store.getState().ingredients;
    expect(fulfilledState.getIngredientRequest).toBe(false);
    expect(fulfilledState.getIngredientError).toBeNull();
    expect(fulfilledState.ingredients).toEqual(mockIngredients);
  });

  test('тестирует неуспешный getIngredient', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    await store.dispatch(getIngredient());

    const rejectedState = store.getState().ingredients;
    expect(rejectedState.getIngredientRequest).toBe(false);
    expect(rejectedState.getIngredientError).not.toBeNull();
    expect(rejectedState.ingredients).toEqual([]);
  });
});
