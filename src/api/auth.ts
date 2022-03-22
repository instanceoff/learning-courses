import { setLoading } from 'containers/App/actions';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Dispatch } from 'redux';
import { IAnswer } from 'types/answer';
import { createAccount } from './account';
import { auth, firestore } from './firebase';

export const createAuth = async (
  dispatch: Dispatch<any>,
  email: string,
  password: string,
): Promise<IAnswer> => {
  try {
    dispatch(setLoading(10));
    const newAcc = await createUserWithEmailAndPassword(auth, email, password);
    console.log(newAcc);
    dispatch(setLoading(50));
    await createAccount(newAcc.user.uid);
    dispatch(setLoading(100));
    return { isComplete: true, answer: ' ' };
  } catch (err) {
    dispatch(setLoading(100));
    const message = (err as Error).message;
    return { isComplete: false, answer: message };
  }
};

export const signIn = async (
  dispatch: Dispatch<any>,
  email: string,
  password: string,
): Promise<IAnswer> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const user = await signInWithEmailAndPassword(auth, email, password);
    return { isComplete: true, answer: user.user.uid };
  } catch (err) {
    const message = (err as Error).message;
    return { isComplete: false, answer: message };
  }
};
