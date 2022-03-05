import { createSelector } from 'reselect';

import { ApplicationRootState } from 'types';

import { initialState } from './reducer';

export const selectGlobalDomain = (state: ApplicationRootState) =>
  state.global || initialState;

export const selectLoading = () =>
  createSelector(selectGlobalDomain, substate => substate.loading);

export const selectCurrentAccount = () =>
  createSelector(selectGlobalDomain, substate => substate.currentAccount);
