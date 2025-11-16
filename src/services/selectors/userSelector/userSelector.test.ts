import {
  getUserAllSelector,
  getUserSelector,
  getUserIsAuhCheckedSelector,
  isAuthenticatedSelector,
  userNameSelector
} from './userSelector';

describe('тестирует селектор userSelector', () => {
  const mockUser = {
    email: 'test@mail.ru',
    name: 'Test User'
  };

  test('тестирует получение всего getUserAllSelector', () => {
    const testState = {
      user: {
        user: mockUser,
        userRequest: false,
        userError: null,
        isAuthChecked: true,
        isAuthenticated: true
      }
    } as any;

    const userState = getUserAllSelector(testState);

    expect(userState).toEqual({
      user: mockUser,
      userRequest: false,
      userError: null,
      isAuthChecked: true,
      isAuthenticated: true
    });
  });

  test('тестирует получение getUserSelector', () => {
    const testState = {
      user: {
        user: mockUser,
        userRequest: false,
        userError: null,
        isAuthChecked: true,
        isAuthenticated: true
      }
    } as any;

    const user = getUserSelector(testState);

    expect(user).toEqual(mockUser);
  });

  test('тестирует получение getUserIsAuhCheckedSelector', () => {
    const testState = {
      user: {
        user: mockUser,
        userRequest: false,
        userError: null,
        isAuthChecked: true,
        isAuthenticated: true
      }
    } as any;

    const isAuthChecked = getUserIsAuhCheckedSelector(testState);

    expect(isAuthChecked).toBe(true);
  });

  test('тестирует получение isAuthenticatedSelector', () => {
    const testState = {
      user: {
        user: mockUser,
        userRequest: false,
        userError: null,
        isAuthChecked: true,
        isAuthenticated: true
      }
    } as any;

    const isAuthenticated = isAuthenticatedSelector(testState);

    expect(isAuthenticated).toBe(true);
  });

  test('тестирует получение userNameSelector', () => {
    const testState = {
      user: {
        user: mockUser,
        userRequest: false,
        userError: null,
        isAuthChecked: true,
        isAuthenticated: true
      }
    } as any;

    const userName = userNameSelector(testState);

    expect(userName).toBe('Test User');
  });
});
