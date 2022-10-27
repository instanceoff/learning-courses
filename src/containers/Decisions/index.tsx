import { decisionConverter } from 'api/document';
import { auth, firestore } from 'api/firebase';
import Button from 'components/Button';
import CardDecision from 'components/CardDecision';
import Header from 'components/Header';
import ModalTask from 'components/ModalTask';
import { query, collection, where, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { IDecision } from 'types/course';

const Decisions = () => {
  const [user, loading, error] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);

  const [decisions, decisionsLoading, decisionsError] = useCollection(
    query(
      collection(firestore, 'decisions'),
      where('teacher', '==', accountDoc),
    ),
  );
  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-gray-800 my-5 p-3">
          <div className="w-fit flex-col">
            {decisions && decisions.size > 0
              ? decisions.docs.map(decision => {
                  const convertedDecision = decisionConverter(decision);
                  return (
                    <CardDecision
                      decision={decision}
                      decisionData={convertedDecision}
                    />
                  );
                })
              : 'Сейчас тут пусто'}
          </div>
        </div>
      </div>
    </>
  );
};

export default Decisions;
