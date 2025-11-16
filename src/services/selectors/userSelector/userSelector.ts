import { RootState } from '../../store';

export const getUserAllSelector = (state: RootState) => state.user;
export const getUserSelector = (state: RootState) => state.user.user;
export const getUserIsAuhCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const isAuthenticatedSelector = (state: RootState) =>
  state.user.isAuthenticated;
export const userNameSelector = (state: RootState) => state.user.user?.name;
