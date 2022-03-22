import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { IAnswer } from 'types/answer';
import { EStatus, IUser } from 'types/user';
import { getRandomUsername } from 'utils/random';
import { firestore } from './firebase';
import { getDatabase } from 'firebase/database';

// export const createCourse = async (uid: string): Promise<IAnswer> => {
//   try {
//     await setDoc(doc(firestore, 'accounts', uid), {
//       name: getRandomUsername(),
//       group: null,
//       status: EStatus.STUDENT,
//     });
//     return { isComplete: true, answer: '' };
//   } catch (error) {
//     const message = (error as Error).message;
//     return { isComplete: false, answer: message };
//   }
// };

export const getCourses = async () => {
  // const coursesQuery = query(collection(firestore, 'courses'));

  // const querySnapshot = await getDocs(coursesQuery);

  const querySnapshot = await getDocs(collection(firestore, 'courses'));

  return querySnapshot.docs;
  // const courses = await getDoc(doc(firestore, 'courses'));
  // const test = courses;
  // return await getDoc(doc(firestore, 'courses'));
};
