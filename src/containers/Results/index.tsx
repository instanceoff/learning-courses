import { stringify } from '@firebase/util';
import { decisionConverter, updateDocument } from 'api/document';
import { auth, firestore } from 'api/firebase';
import Button from 'components/Button';
import CardDecision from 'components/CardDecision';
import Header from 'components/Header';
import ModalDecision from 'components/ModalDecision';
import ModalTask from 'components/ModalTask';
import {
  query,
  collection,
  where,
  doc,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  getDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { IDecision } from 'types/course';

const Decisions = () => {
  const [user, loading, error] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);

  const [decisions, decisionsLoading, decisionsError] = useCollection(
    query(collection(firestore, 'decisions'), where('user', '==', accountDoc)),
  );

  const [test, setTest] = useState('xexe');

  const setCourseName = async (
    decision: QueryDocumentSnapshot<DocumentData>,
  ) => {
    const courseRef = decision.get('course');
    const courseSnap = await getDoc(courseRef);
    const courseName = courseSnap.get('title');
    await updateDocument(decision.ref, { courseName: courseName });
  };

  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-gray-800 my-5 p-3">
          <div className="w-fit flex-col">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Курс
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Задание
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Оценка
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Открыть</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {decisions?.docs.map(decision => {
                    const convertedDecision = decisionConverter(decision);
                    setCourseName(decision);
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        >
                          {convertedDecision.courseName}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        >
                          {convertedDecision.title}
                        </th>
                        <td className="px-6 py-4">
                          {convertedDecision.score === 0
                            ? 'Не оценено'
                            : convertedDecision.score}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            data-modal-toggle={decision.id}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Открыть
                          </button>
                        </td>
                        <ModalDecision
                          decision={decision}
                          decisionData={convertedDecision}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Decisions;
