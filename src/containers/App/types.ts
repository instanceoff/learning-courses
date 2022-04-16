import * as actions from './actions';

import { ActionType } from 'typesafe-actions';
import { IUser } from 'types/user';

interface AppState {
  loading: number | null;
  currentAccount: IUser | null;
  darkMode: boolean;
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

export type ContainerState = AppState;
export type ContainerActions = AppActions;
