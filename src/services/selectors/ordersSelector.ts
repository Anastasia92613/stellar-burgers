import { RootState } from '../store';

export const ordersSelector = (state: RootState) => state.orders.orders;
export const orderFeedsSelector = (state: RootState) => state.orders.ordersFeed;
export const ordersRequestSelector = (state: RootState) =>
  state.orders.ordersRequest;
export const totalTodayFeedSelector = (state: RootState) =>
  state.orders.totalTodayFeed;
export const totalFeedSelector = (state: RootState) => state.orders.totalFeed;
