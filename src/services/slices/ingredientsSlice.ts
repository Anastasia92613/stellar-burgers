import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface TIngredientState {
  ingredients: TIngredient[];
  getIngredientError: string | null;
  getIngredientRequest: boolean;
}

const initialState: TIngredientState = {
  ingredients: [],
  getIngredientError: null,
  getIngredientRequest: false
};

export const getIngredient = createAsyncThunk(
  'ingredients/getAll',
  async (_, { rejectWithValue }) => {
    const data = await getIngredientsApi();
    if (!data || data.length === 0) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredient.pending, (state) => {
        state.getIngredientRequest = true;
        state.getIngredientError = null;
      })
      .addCase(getIngredient.rejected, (state, action) => {
        state.getIngredientRequest = false;
        state.getIngredientError = action.payload as string;
      })
      .addCase(getIngredient.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.getIngredientRequest = false;
      });
  }
});

export default ingredientsSlice.reducer;
