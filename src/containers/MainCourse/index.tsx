import { firestore } from 'api/firebase';
import Card from 'components/Card';
import Header from 'components/Header';
import Loading from 'components/Loading';
import { collection, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

const MainCourse = id => {
  const currentCourse = document.location.pathname;

  const [courses, loading, error] = useCollection(
    query(collection(firestore, 'courses'), orderBy('createdAt')),
  );

  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-300 my-5 p-3">
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
                courses?.docs.map(doc => {
                  if (doc.id === currentCourse)
                    return (
                      <Card
                        key={doc.id}
                        title={doc.get('title')}
                        description={doc.get('description')}
                        imageURL={doc.get('imageURL')}
                        courseURL={doc.id}
                      />
                    );
                  return null;
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainCourse;
