import { forgotPasswordSelector } from './forgotPasswordSelector';

describe('тестирует селектор forgotPasswordSelector', () => {
  const mockState = {
    forgotPassword: {
      forgotPasswordRequest: false,
      forgotPasswordError: null,
      success: true
    }
  } as any;

  test('получение всего forgotPassword', () => {
    const forgotPassword = forgotPasswordSelector(mockState);

    expect(forgotPassword).toEqual({
      forgotPasswordRequest: false,
      forgotPasswordError: null,
      success: true
    });
  });
});
