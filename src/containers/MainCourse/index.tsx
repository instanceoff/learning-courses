import { firestore } from 'api/firebase';
import MaterialsCard from 'components/MaterialsCard';
import Header from 'components/Header';
import Loading from 'components/Loading';
import {
  collection,
  documentId,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { stringify } from 'querystring';
import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import TaskCard from 'components/TaskCard';

type TMainCourse = {
  id?: string;
};

const MainCourse: React.FC<TMainCourse> = id => {
  const [courses, loading, error] = useCollection(
    query(
      collection(firestore, 'courses'),
      where(documentId(), '==', document.location.pathname.slice(1)),
    ),
  );
  const currentCourse = courses?.docs.find(doc => {
    return doc.id === id.id;
  });
  return (
    <>
      <Header />
      <div className="flex flex-col mx-2">
        <div className="mx-auto rounded-lg bg-slate-300 mt-5 p-3">
          <div className="w-fit flex-col">
            <div
              className={` max-w-screen-lg flex justify-center  xl:justify-start ${
                courses?.size === 1 && 'justify-center'
              }  flex-wrap`}
            >
              {error ? (
                <div>{error}</div>
              ) : loading ? (
                <Loading />
              ) : (
                <MaterialsCard
                  key={currentCourse?.id}
                  title={currentCourse?.get('title')}
                  description={currentCourse?.get('description')}
                  imageURL={currentCourse?.get('imageURL')}
                  materialURL={currentCourse?.id}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto rounded-lg bg-slate-300 my-3 p-3">
          <div className="w-fit flex-col">
            <div
              className={` max-w-screen-lg flex justify-center  xl:justify-start ${
                courses?.size === 1 && 'justify-center'
              }  flex-wrap`}
            >
              {error ? (
                <div>{error}</div>
              ) : loading ? (
                <Loading />
              ) : (
                <TaskCard
                  key={currentCourse?.id}
                  title={currentCourse?.get('title')}
                  description={currentCourse?.get('description')}
                  imageURL={currentCourse?.get('imageURL')}
                  courseURL={currentCourse?.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainCourse;
