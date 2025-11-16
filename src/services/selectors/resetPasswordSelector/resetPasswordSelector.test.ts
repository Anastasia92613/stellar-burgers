import { resetPasswordSelector } from './resetPasswordSelector';

describe('тестирует селектор resetPasswordSelector', () => {
  test('получение всего resetPassword', () => {
    const testState = {
      resetPassword: {
        resetPasswordRequest: false,
        resetPasswordError: null,
        success: true
      }
    } as any;

    const resetPasswordState = resetPasswordSelector(testState);

    expect(resetPasswordState).toEqual({
      resetPasswordRequest: false,
      resetPasswordError: null,
      success: true
    });
  });
});
