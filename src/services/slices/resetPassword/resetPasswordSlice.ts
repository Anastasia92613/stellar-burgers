import { resetPasswordApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TResetPasswordState {
  resetPasswordRequest: boolean;
  resetPasswordError: string | null;
  success: boolean;
}

const initialState: TResetPasswordState = {
  resetPasswordRequest: false,
  resetPasswordError: null,
  success: false
};

// Экшен для сброса пароля
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    const data = await resetPasswordApi({ password, token });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordRequest = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordRequest = false;
        state.resetPasswordError = action.payload as string;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordRequest = false;
        state.resetPasswordError = null;
        state.success = action.payload.success;
      });
  }
});

export default resetPasswordSlice.reducer;
