import { doc, getDoc, setDoc } from 'firebase/firestore';
import { IAnswer } from 'types/answer';
import { EStatus, IUser } from 'types/user';
import { getRandomUsername } from 'utils/random';
import { firestore } from './firebase';

export const createAccount = async (uid: string): Promise<IAnswer> => {
  try {
    await setDoc(doc(firestore, 'accounts', uid), {
      name: getRandomUsername(),
      group: null,
      status: EStatus.STUDENT,
    });
    return { isComplete: true, answer: '' };
  } catch (error) {
    const message = (error as Error).message;
    return { isComplete: false, answer: message };
  }
};

export const getAccount = async (uid: string): Promise<IAnswer> => {
  try {
    const account = await getDoc(doc(firestore, 'accounts', uid));
    if (account.exists())
      return { isComplete: true, answer: account.data() as IUser };
    return { isComplete: false, answer: 'User not founded' };
  } catch (error) {
    const message = (error as Error).message;
    return { isComplete: false, answer: message };
  }
};
