import {
  constructorItemsBunSelector,
  constructorItemsIngredientsSelector,
  constructorItemsSelector
} from './constructorItemsSelector';

describe('тестирует селектор constructorItemsSelector', () => {
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
    id: 'constructor-ingredient-1',
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
    id: 'constructor-ingredient-2',
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

  test('получение всего constructorItemsSelector', () => {
    const testState = {
      constructorItems: {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      }
    } as any;

    const constructorItems = constructorItemsSelector(testState);

    expect(constructorItems).toEqual({
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2]
    });
  });

  test('получение Bun', () => {
    const testState = {
      constructorItems: {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      }
    } as any;

    const bun = constructorItemsBunSelector(testState);

    expect(bun).toEqual(mockBun);
  });

  test('получение ingredients', () => {
    const testState = {
      constructorItems: {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      }
    } as any;

    const ingredients = constructorItemsIngredientsSelector(testState);

    expect(ingredients).toEqual([mockIngredient1, mockIngredient2]);
  });

  test('получение пустого constructorItems', () => {
    const testState = {
      constructorItems: {
        bun: null,
        ingredients: []
      }
    } as any;

    const constructorItems = constructorItemsSelector(testState);
    const bun = constructorItemsBunSelector(testState);
    const ingredients = constructorItemsIngredientsSelector(testState);

    expect(constructorItems).toEqual({ bun: null, ingredients: [] });
    expect(bun).toBeNull();
    expect(ingredients).toEqual([]);
  });
});
