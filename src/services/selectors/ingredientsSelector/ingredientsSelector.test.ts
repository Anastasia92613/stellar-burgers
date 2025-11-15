import {
  ingredientsSelectorAll,
  ingredientsSelector,
  ingredientRequestSelector
} from './ingredientsSelector';

describe('тестирует селектор ingredientsSelector', () => {
  const mockIngredients = [
    {
      _id: 'ingredient-1',
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
    },
    {
      _id: 'ingredient-2',
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
    }
  ];

  test('тестирует получение ingredientsSelectorAll', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        getIngredientError: null,
        getIngredientRequest: false
      }
    } as any;

    const ingredientsState = ingredientsSelectorAll(testState);

    expect(ingredientsState).toEqual({
      ingredients: mockIngredients,
      getIngredientError: null,
      getIngredientRequest: false
    });
  });

  test('тестирует получение ingredientsSelector', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        getIngredientError: null,
        getIngredientRequest: false
      }
    } as any;

    const ingredients = ingredientsSelector(testState);

    expect(ingredients).toEqual(mockIngredients);
  });

  test('тестирует получение ingredientRequestSelector', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        getIngredientError: null,
        getIngredientRequest: true
      }
    } as any;

    const isRequesting = ingredientRequestSelector(testState);

    expect(isRequesting).toBe(true);
  });
});
