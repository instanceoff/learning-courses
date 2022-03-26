import React from 'react';
import Card from 'components/Card';
import Header from 'components/Header';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { firestore } from 'api/firebase';
import Loading from 'components/Loading';

const Courses = () => {
  const [courses, loading, error] = useCollection(
    collection(firestore, 'courses'),
  );

  return (
    <>
      <Header />
      <div className="flex w-screen">
        <div className="max-w-screen-lg w-fit flex col mx-auto my-5 flex-wrap">
          {error ? (
            <div>{error}</div>
          ) : loading ? (
            <Loading />
          ) : (
            courses?.docs.map(doc => {
              return (
                <Card
                  key={doc.id}
                  title={doc.get('title')}
                  description={doc.get('description')}
                  imageURL={doc.get('imageURL')}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
