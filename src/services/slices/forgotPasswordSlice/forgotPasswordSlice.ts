import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forgotPasswordApi } from '@api';

interface TForgotPasswordState {
  forgotPasswordRequest: boolean;
  forgotPasswordError: string | null;
  success: boolean;
}

const initialState: TForgotPasswordState = {
  forgotPasswordRequest: false,
  forgotPasswordError: null,
  success: false
};

// Экшен для восстановления пароля
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    const data = await forgotPasswordApi({ email });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordRequest = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordError = action.payload as string;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordError = null;
        state.success = action.payload.success;
      });
  }
});

export default forgotPasswordSlice.reducer;
