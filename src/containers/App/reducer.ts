import { Reducers, Reducer } from 'types/reducers';

import { ContainerState, ContainerActions } from './types';
import { ActionTypes } from './constants';

export const initialState: ContainerState = {
  loading: null,
  currentAccount: null,
  darkMode: false,
};

type ReducerActions = ContainerActions;

const reducers: Partial<Reducers<ReducerActions, ContainerState>> = {
  [ActionTypes.SET_LOADING]: payload => state => ({
    ...state,
    loading: payload.percent,
  }),
  [ActionTypes.SET_CURRENT_ACCOUNT]: payload => state => ({
    ...state,
    currentAccount: payload.currentAccount,
  }),
  [ActionTypes.SET_DARK_MODE]: payload => state => ({
    ...state,
    darkMode: payload.darkMode,
  }),
};

function appReducer(
  state: ContainerState = initialState,
  action: ContainerActions,
): ContainerState {
  const { type, payload } = action;

  const reducer:
    | undefined
    | Reducer<typeof type, ContainerActions, ContainerState> = reducers[type];

  return reducer ? reducer(payload)(state) : state;
}

export default appReducer;
