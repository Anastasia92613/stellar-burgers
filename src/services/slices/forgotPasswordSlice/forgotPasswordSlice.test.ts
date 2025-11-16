import { configureStore } from '@reduxjs/toolkit';
import forgotPasswordReducer, { forgotPassword } from './forgotPasswordSlice';

describe('тестирует редьюсер forgotPasswordSlice', () => {
  const mockEmail = 'test@example.com';

  const mockSuccessResponse = {
    success: true,
    message: 'Пароль изменен успешно'
  };

  const mockErrorResponse = {
    success: false,
    message: 'Пользователь не найден'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешный forgotPassword', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { forgotPassword: forgotPasswordReducer }
    });

    const initialState = store.getState().forgotPassword;
    expect(initialState.forgotPasswordRequest).toBe(false);
    expect(initialState.forgotPasswordError).toBeNull();
    expect(initialState.success).toBe(false);

    const dispatchPromise = store.dispatch(forgotPassword(mockEmail));

    const pendingState = store.getState().forgotPassword;
    expect(pendingState.forgotPasswordRequest).toBe(true);
    expect(pendingState.forgotPasswordError).toBeNull();
    expect(pendingState.success).toBe(false);

    await dispatchPromise;

    const fulfilledState = store.getState().forgotPassword;
    expect(fulfilledState.forgotPasswordRequest).toBe(false);
    expect(fulfilledState.forgotPasswordError).toBeNull();
    expect(fulfilledState.success).toBe(true);
  });

  test('тестирует неуспешный forgotPassword', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { forgotPassword: forgotPasswordReducer }
    });

    await store.dispatch(forgotPassword(mockEmail));

    const rejectedState = store.getState().forgotPassword;
    expect(rejectedState.forgotPasswordRequest).toBe(false);
    expect(rejectedState.forgotPasswordError).not.toBeNull();
    expect(rejectedState.success).toBe(false);
  });
});
