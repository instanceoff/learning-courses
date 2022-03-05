export interface Action {
  type: string;
  payload: any;
}

export type Reducer<T, A extends Action, S> = (
  payload: Extract<A, { type: T }>['payload'],
) => (state: S) => S;

export type Reducers<A extends Action, S> = {
  [T in A['type']]: Reducer<T, A, S>;
};

export default Reducers;
