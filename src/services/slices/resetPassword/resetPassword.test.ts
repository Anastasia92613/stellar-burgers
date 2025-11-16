import { configureStore } from '@reduxjs/toolkit';
import resetPasswordReducer, { resetPassword } from './resetPasswordSlice';

describe('тестирует редьюсер resetPasswordSlice', () => {
  const mockPassword = 'newPassword123';
  const mockToken = 'reset-token-123';

  const mockSuccessResponse = {
    success: true,
    message: 'Password reset successful'
  };

  const mockErrorResponse = {
    success: false,
    message: 'Неверный токен'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тестирует успешный resetPassword', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { resetPassword: resetPasswordReducer }
    });

    const initialState = store.getState().resetPassword;
    expect(initialState.resetPasswordRequest).toBe(false);
    expect(initialState.resetPasswordError).toBeNull();
    expect(initialState.success).toBe(false);

    const dispatchPromise = store.dispatch(
      resetPassword({ password: mockPassword, token: mockToken })
    );

    const pendingState = store.getState().resetPassword;
    expect(pendingState.resetPasswordRequest).toBe(true);
    expect(pendingState.resetPasswordError).toBeNull();
    expect(pendingState.success).toBe(false);

    await dispatchPromise;

    const fulfilledState = store.getState().resetPassword;
    expect(fulfilledState.resetPasswordRequest).toBe(false);
    expect(fulfilledState.resetPasswordError).toBeNull();
    expect(fulfilledState.success).toBe(true);
  });

  test('тестирует неуспешный resetPassword', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { resetPassword: resetPasswordReducer }
    });

    await store.dispatch(
      resetPassword({ password: mockPassword, token: mockToken })
    );

    const rejectedState = store.getState().resetPassword;
    expect(rejectedState.resetPasswordRequest).toBe(false);
    expect(rejectedState.resetPasswordError).not.toBeNull();
    expect(rejectedState.success).toBe(false);
  });
});
