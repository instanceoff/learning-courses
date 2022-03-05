import { IUser } from 'types/user';
import { action } from 'typesafe-actions';
import { ActionTypes } from './constants';

export const setLoading = (percent: number | null) =>
  action(ActionTypes.SET_LOADING, { percent });

export const setCurrentAccount = (currentAccount: IUser) =>
  action(ActionTypes.SET_CURRENT_ACCOUNT, { currentAccount });
