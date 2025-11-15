import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  getUser,
  loginUser,
  logout,
  registerUser,
  updateUser
} from '../userSlice/userSlice';

describe('тестирует редьюсер userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешное getUser', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const mockResponse = {
      success: true,
      user: mockUser
    };

    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch = jest.fn(() => fetchPromise) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const initialState = store.getState().user;
    expect(initialState.userRequest).toBe(false);
    expect(initialState.userError).toBeNull();
    expect(initialState.user).toBeNull();
    expect(initialState.isAuthChecked).toBe(false);

    const dispatchPromise = store.dispatch(getUser());

    const pendingState = store.getState().user;
    expect(pendingState.userRequest).toBe(true);
    expect(pendingState.userError).toBeNull();
    expect(pendingState.user).toBeNull();
    expect(pendingState.isAuthChecked).toBe(false);

    resolveFetch!({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    await dispatchPromise;

    const fulfilledState = store.getState().user;
    expect(fulfilledState.user).toEqual(mockUser);
    expect(fulfilledState.userRequest).toBe(false);
    expect(fulfilledState.userError).toBeNull();
    expect(fulfilledState.isAuthChecked).toBe(true);
  });

  test('тестирует с ошибкой getUser', async () => {
    const errorResponse = {
      success: false,
      message: 'Ошибка сервера'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(errorResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(getUser());

    const rejectedState = store.getState().user;
    expect(rejectedState.userRequest).toBe(false);
    expect(rejectedState.userError).toEqual(errorResponse);
    expect(rejectedState.user).toBeNull();
    expect(rejectedState.isAuthChecked).toBe(true);
  });

  test('тестирует успешный loginUser', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const mockResponse = {
      success: true,
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    const setCookieMock = jest.fn();
    jest
      .spyOn(require('../../../utils/cookie'), 'setCookie')
      .mockImplementation(setCookieMock);

    const localStorageSetItemMock = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: localStorageSetItemMock,
        getItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const initialState = store.getState().user;
    expect(initialState.userRequest).toBe(false);
    expect(initialState.userError).toBeNull();
    expect(initialState.user).toBeNull();
    expect(initialState.isAuthChecked).toBe(false);
    expect(initialState.isAuthenticated).toBe(false);

    const dispatchPromise = store.dispatch(
      loginUser({ email: 'test@mail.ru', password: 'password' })
    );

    const pendingState = store.getState().user;
    expect(pendingState.user).toBeNull();
    expect(pendingState.userRequest).toBe(true);
    expect(pendingState.isAuthenticated).toBe(false);
    expect(pendingState.isAuthChecked).toBe(false);
    expect(pendingState.userError).toBeNull();

    await dispatchPromise;

    const fulfilledState = store.getState().user;
    expect(fulfilledState.user).toEqual(mockUser);
    expect(fulfilledState.userRequest).toBe(false);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.isAuthChecked).toBe(true);
    expect(fulfilledState.userError).toBeNull();

    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'mock-access-token'
    );
    expect(localStorageSetItemMock).toHaveBeenCalledWith(
      'refreshToken',
      'mock-refresh-token'
    );
  });

  test('тестирует неуспешный loginUser', async () => {
    const errorResponse = {
      success: false,
      message: 'Неверный email или пароль'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(errorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    await store.dispatch(
      loginUser({ email: 'wrong@mail.ru', password: 'wrongpassword' })
    );

    const state = store.getState().user;

    expect(state.userRequest).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  test('тестирует успешный updateUser', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const updatedUser = {
      email: 'updated@mail.ru',
      name: 'updated name'
    };

    const mockResponse = {
      success: true,
      user: updatedUser
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { user: userReducer }
    });

    store.dispatch({
      type: 'auth/getUser/fulfilled',
      payload: { success: true, user: mockUser }
    });

    const initialState = store.getState().user;
    expect(initialState.user).toEqual(mockUser);
    expect(initialState.userRequest).toBe(false);
    expect(initialState.userError).toBeNull();

    const dispatchPromise = store.dispatch(
      updateUser({ name: 'updated', email: 'updated@mail.ru' })
    );

    const pendingState = store.getState().user;
    expect(pendingState.userRequest).toBe(true);
    expect(pendingState.userError).toBeNull();
    expect(pendingState.user).toEqual(mockUser);

    await dispatchPromise;

    const fulfilledState = store.getState().user;
    expect(fulfilledState.userRequest).toBe(false);
    expect(fulfilledState.userError).toBeNull();
    expect(fulfilledState.user).toEqual(updatedUser);
  });

  test('тестирует неуспешный updateUser', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const errorResponse = {
      success: false,
      message: 'Ошибка обновления'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(errorResponse)
      })
    ) as jest.Mock;

    jest
      .spyOn(require('../../../utils/cookie'), 'getCookie')
      .mockReturnValue('mock-token');

    const store = configureStore({
      reducer: { user: userReducer }
    });

    store.dispatch({
      type: 'auth/getUser/fulfilled',
      payload: { success: true, user: mockUser }
    });

    await store.dispatch(updateUser({ name: 'new name' }));

    const rejectedState = store.getState().user;
    expect(rejectedState.userRequest).toBe(false);
    expect(rejectedState.userError).not.toBeNull();
    expect(rejectedState.user).toEqual(mockUser);
  });

  test('тестирует успешный registerUser', async () => {
    const mockUser = {
      email: 'newuser@mail.ru',
      name: 'NewUser'
    };

    const mockResponse = {
      success: true,
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    const setCookieMock = jest.fn();
    jest
      .spyOn(require('../../../utils/cookie'), 'setCookie')
      .mockImplementation(setCookieMock);

    const localStorageSetItemMock = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: localStorageSetItemMock,
        getItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const initialState = store.getState().user;
    expect(initialState.userRequest).toBe(false);
    expect(initialState.userError).toBeNull();
    expect(initialState.user).toBeNull();
    expect(initialState.isAuthChecked).toBe(false);
    expect(initialState.isAuthenticated).toBe(false);

    const registerData = {
      email: 'newuser@mail.ru',
      password: 'password123',
      name: 'NewUser'
    };

    const dispatchPromise = store.dispatch(registerUser(registerData));

    const pendingState = store.getState().user;
    expect(pendingState.userRequest).toBe(true);
    expect(pendingState.userError).toBeNull();
    expect(pendingState.user).toBeNull();
    expect(pendingState.isAuthChecked).toBe(false);
    expect(pendingState.isAuthenticated).toBe(false);

    await dispatchPromise;

    const fulfilledState = store.getState().user;
    expect(fulfilledState.userRequest).toBe(false);
    expect(fulfilledState.userError).toBeNull();
    expect(fulfilledState.user).toEqual(mockUser);
    expect(fulfilledState.isAuthChecked).toBe(true);
    expect(fulfilledState.isAuthenticated).toBe(true);

    expect(setCookieMock).toHaveBeenCalledWith(
      'accessToken',
      'mock-access-token'
    );
    expect(localStorageSetItemMock).toHaveBeenCalledWith(
      'refreshToken',
      'mock-refresh-token'
    );
  });

  test('тестирует неуспешный registerUser', async () => {
    const errorResponse = {
      success: false,
      message: 'Пользователь уже существует'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(errorResponse)
      })
    ) as jest.Mock;

    const setCookieMock = jest.fn();
    jest
      .spyOn(require('../../../utils/cookie'), 'setCookie')
      .mockImplementation(setCookieMock);

    const localStorageSetItemMock = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: localStorageSetItemMock,
        getItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const registerData = {
      email: 'existing@mail.ru',
      password: 'password123',
      name: 'Existing User'
    };

    await store.dispatch(registerUser(registerData));

    const rejectedState = store.getState().user;
    expect(rejectedState.userRequest).toBe(false);
    expect(rejectedState.userError).not.toBeNull();
    expect(rejectedState.user).toBeNull();
    expect(rejectedState.isAuthChecked).toBe(true);
    expect(rejectedState.isAuthenticated).toBe(false);

    expect(setCookieMock).not.toHaveBeenCalled();
    expect(localStorageSetItemMock).not.toHaveBeenCalled();
  });

  test('тестирует успешный logout', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const mockResponse = {
      success: true
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;

    const deleteCookieMock = jest.fn();
    jest
      .spyOn(require('../../../utils/cookie'), 'deleteCookie')
      .mockImplementation(deleteCookieMock);

    const localStorageRemoveItemMock = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: localStorageRemoveItemMock
      },
      writable: true
    });

    const store = configureStore({
      reducer: { user: userReducer }
    });

    store.dispatch({
      type: 'auth/loginUser/fulfilled',
      payload: {
        success: true,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh-token'
      }
    });

    const initialState = store.getState().user;
    expect(initialState.user).toEqual(mockUser);
    expect(initialState.isAuthenticated).toBe(true);
    expect(initialState.userRequest).toBe(false);
    expect(initialState.userError).toBeNull();

    const dispatchPromise = store.dispatch(logout());

    const pendingState = store.getState().user;
    expect(pendingState.userRequest).toBe(true);
    expect(pendingState.userError).toBeNull();
    expect(pendingState.user).toEqual(mockUser);
    expect(pendingState.isAuthenticated).toBe(true);

    await dispatchPromise;

    const fulfilledState = store.getState().user;
    expect(fulfilledState.userRequest).toBe(false);
    expect(fulfilledState.userError).toBeNull();
    expect(fulfilledState.user).toBeNull();
    expect(fulfilledState.isAuthenticated).toBe(false);

    expect(deleteCookieMock).toHaveBeenCalledWith('accessToken');
    expect(localStorageRemoveItemMock).toHaveBeenCalledWith('refreshToken');
  });

  test('тестирует неуспешный logout', async () => {
    const mockUser = {
      email: 'test@mail.ru',
      name: 'test'
    };

    const errorResponse = {
      success: false,
      message: 'Ошибка выхода'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(errorResponse)
      })
    ) as jest.Mock;

    const deleteCookieMock = jest.fn();
    jest
      .spyOn(require('../../../utils/cookie'), 'deleteCookie')
      .mockImplementation(deleteCookieMock);

    const localStorageRemoveItemMock = jest.fn();
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: localStorageRemoveItemMock
      },
      writable: true
    });

    const store = configureStore({
      reducer: { user: userReducer }
    });

    store.dispatch({
      type: 'auth/loginUser/fulfilled',
      payload: {
        success: true,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh-token'
      }
    });

    await store.dispatch(logout());

    const rejectedState = store.getState().user;
    expect(rejectedState.userRequest).toBe(false);
    expect(rejectedState.userError).not.toBeNull();
    expect(rejectedState.user).toEqual(mockUser); // Пользователь остался
    expect(rejectedState.isAuthenticated).toBe(true); // Остался аутентифицирован

    expect(deleteCookieMock).not.toHaveBeenCalled();
    expect(localStorageRemoveItemMock).not.toHaveBeenCalled();
  });
});
