import constructorItemsReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorItemsSlice';

describe('тестирует редьюсер constructorItemsSlice', () => {
  const mockBun = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'bun.jpg',
    image_mobile: 'bun-mobile.jpg',
    image_large: 'bun-large.jpg'
  };

  const mockIngredient1 = {
    _id: 'ingredient-1',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 150,
    price: 150,
    image: 'ingredient1.jpg',
    image_mobile: 'ingredient1-mobile.jpg',
    image_large: 'ingredient1-large.jpg'
  };

  const mockIngredient2 = {
    _id: 'ingredient-2',
    name: 'Сыр',
    type: 'main',
    proteins: 25,
    fat: 30,
    carbohydrates: 2,
    calories: 350,
    price: 100,
    image: 'ingredient2.jpg',
    image_mobile: 'ingredient2-mobile.jpg',
    image_large: 'ingredient2-large.jpg'
  };

  const mockIngredient3 = {
    ...mockIngredient1,
    _id: 'ingredient-3',
    name: 'Соус'
  };

  const newBun = {
    ...mockBun,
    _id: 'bun-2',
    name: 'Новая булка'
  };

  test('тестирует addBun', () => {
    const action = addBun(mockBun);
    const state = constructorItemsReducer(undefined, action);

    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('тестирует addBun с заменой существующей булки', () => {
    let state = constructorItemsReducer(undefined, addBun(mockBun));
    expect(state.bun).toEqual(mockBun);

    state = constructorItemsReducer(state, addBun(newBun));

    expect(state.bun).toEqual(newBun);
    expect(state.bun?._id).toBe('bun-2');
  });

  test('тестирует addIngredient', () => {
    const action = addIngredient(mockIngredient1);
    const state = constructorItemsReducer(undefined, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient1,
      id: expect.any(String)
    });
  });

  test('тестирует removeIngredient', () => {
    let state = constructorItemsReducer(
      undefined,
      addIngredient(mockIngredient1)
    );
    state = constructorItemsReducer(state, addIngredient(mockIngredient2));

    const ingredientIdToRemove = state.ingredients[0].id;

    state = constructorItemsReducer(
      state,
      removeIngredient(ingredientIdToRemove)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).not.toBe(ingredientIdToRemove);
  });

  test('тестирует неуспешное removeIngredient', () => {
    let state = constructorItemsReducer(
      undefined,
      addIngredient(mockIngredient1)
    );
    const initialState = state;

    state = constructorItemsReducer(state, removeIngredient('non-existent-id'));

    expect(state.ingredients).toHaveLength(1);
    expect(state).toEqual(initialState);
  });

  test('тестирует moveIngredient', () => {
    let state = constructorItemsReducer(
      undefined,
      addIngredient(mockIngredient1)
    );
    state = constructorItemsReducer(state, addIngredient(mockIngredient2));
    state = constructorItemsReducer(state, addIngredient(mockIngredient3));

    const initialOrder = state.ingredients.map((item) => item._id);

    state = constructorItemsReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    const finalOrder = state.ingredients.map((item) => item._id);

    expect(finalOrder[0]).toBe(initialOrder[1]);
    expect(finalOrder[1]).toBe(initialOrder[2]);
    expect(finalOrder[2]).toBe(initialOrder[0]);
  });

  test('тестирует clearConstructor', () => {
    let state = constructorItemsReducer(undefined, addBun(mockBun));
    state = constructorItemsReducer(state, addIngredient(mockIngredient1));
    state = constructorItemsReducer(state, addIngredient(mockIngredient2));

    expect(state.bun).not.toBeNull();
    expect(state.ingredients).toHaveLength(2);

    state = constructorItemsReducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
