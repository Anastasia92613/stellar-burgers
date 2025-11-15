import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderBurger {
  orderModalData: {
    order: TOrder;
    name: string;
  } | null;
  success: boolean;
  orderBurgerError: string | null;
  orderBurgerRequest: boolean;
}

const initialState: TOrderBurger = {
  success: false,
  orderModalData: null,
  orderBurgerError: null,
  orderBurgerRequest: false
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[], { rejectWithValue }) => {
    const data = await orderBurgerApi(ingredients);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.orderBurgerError = null;
      state.orderBurgerRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderBurgerRequest = true;
        state.orderBurgerError = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderBurgerError = action.payload as string;
        state.orderBurgerRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderBurgerRequest = false;
        state.orderModalData = action.payload;
        state.success = action.payload.success;
      });
  }
});

export const { clearOrder } = orderBurgerSlice.actions;
export default orderBurgerSlice.reducer;
