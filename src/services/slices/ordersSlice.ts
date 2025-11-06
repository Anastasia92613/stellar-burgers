import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderState {
  orders: TOrder[];
  orderByNumber: TOrder[];
  ordersFeed: TOrder[];
  totalTodayFeed: number;
  totalFeed: number;
  ordersError: string | null;
  ordersRequest: boolean;
}

const initialState: TOrderState = {
  orders: [],
  orderByNumber: [],
  ordersFeed: [],
  totalTodayFeed: 0,
  totalFeed: 0,
  ordersError: null,
  ordersRequest: false
};

//экшен получения заказов с авторизацией
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    const data = await getOrdersApi();
    if (!data) {
      return rejectWithValue(data);
    }
    return data;
  }
);

//экшен полученя заказа по номеру
export const orderByNumber = createAsyncThunk(
  'orders/orderByNumber',
  async (number: number, { rejectWithValue }) => {
    const data = await getOrderByNumberApi(number);
    if (!data.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

//экшен получения заказов без авторизации
export const getFeeds = createAsyncThunk(
  'orders/get',
  async (_, { rejectWithValue }) => {
    const data = await getFeedsApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

//обработка экшенов заказов
export const ordersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.ordersRequest = true;
        state.ordersError = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.ordersRequest = false;
        state.ordersError = action.payload as string;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersRequest = false;
      })
      .addCase(orderByNumber.pending, (state) => {
        state.ordersRequest = true;
        state.ordersError = null;
      })
      .addCase(orderByNumber.rejected, (state, action) => {
        state.ordersError = action.payload as string;
        state.ordersRequest = false;
      })
      .addCase(orderByNumber.fulfilled, (state, action) => {
        state.ordersRequest = false;
        state.orderByNumber = action.payload.orders;
      })
      .addCase(getFeeds.pending, (state) => {
        state.ordersRequest = true;
        state.ordersError = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.ordersRequest = false;
        state.ordersError = action.payload as string;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.ordersFeed = action.payload.orders;
        state.totalFeed = action.payload.total;
        state.totalTodayFeed = action.payload.totalToday;
        state.ordersRequest = false;
      });
  }
});

export default ordersSlice.reducer;
