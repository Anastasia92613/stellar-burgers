import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TRegisterData, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

interface TGetUserState {
  user: TUser | null;
  getUserRequest: boolean;
  getUserError: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userError: string | null;
  userRequest: boolean;
}

const initialState: TGetUserState = {
  user: null,
  getUserRequest: false,
  getUserError: null,
  isAuthChecked: false,
  isAuthenticated: false,
  userError: null,
  userRequest: false
};

// Экшен для получения данных пользователя
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No token');
    }
    const data = await getUserApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);
//экшен логина пользователя
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

// Экшен для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    const data = await updateUserApi(userData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ email, password, name });
    if (!data.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

// Экшен для выхода из системы
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const data = await logoutApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return data;
  }
);

export const userSlice = createSlice({
  name: 'getUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.getUserRequest = true;
        state.getUserError = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUserRequest = false;
        state.getUserError = action.payload as string;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.getUserRequest = false;
        state.getUserError = null;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      //экшен перед вызовом ассинхронной операции
      .addCase(loginUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      //экшен для асинхронной операции с ошибкой
      .addCase(loginUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
        state.isAuthChecked = true;
      })
      ///экшен для успешной асинхронной операции
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userRequest = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logout.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export default userSlice.reducer;
