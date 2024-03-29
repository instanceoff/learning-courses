import React, { useState } from 'react';
import Card from 'components/Card';
import Header from 'components/Header';
import {
  collection,
  query,
  orderBy,
  doc,
  where,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { auth, firestore } from 'api/firebase';
import Loading from 'components/Loading';
import Button from 'components/Button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createNewCourse } from 'api/document';

interface ICourseCreationProps {
  accountDoc: DocumentReference<DocumentData>;
}

const CourseCreation: React.FC<ICourseCreationProps> = ({ accountDoc }) => {
  const [courseTitle, setCourseTitle] = useState('');

  const createCourseHandler = () => {
    createNewCourse(courseTitle, accountDoc);
  };

  return (
    <>
      <div className="xl:w-96 flex">
        <input
          type="text"
          className="
form-control
block
w-full
px-3
py-1.5
text-base
font-normal
text-gray-700
bg-white bg-clip-padding
border border-solid border-gray-300
rounded
transition
ease-in-out
m-0
mr-5
focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
"
          id="courseTitleInput"
          placeholder="Наименование курса"
          onChange={e => {
            setCourseTitle(e.target.value);
          }}
        />
      </div>

      <Button title="Создать курс" onClick={createCourseHandler} />
    </>
  );
};

const Courses = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);

  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  const teacherQuery = query(
    collection(firestore, 'courses'),
    where('teacher', '==', accountDoc),
    orderBy('createdAt'),
  );

  const studentQuery = query(
    collection(firestore, 'courses'),
    where('groups', 'array-contains', userDoc?.get('group') || '0'),
    orderBy('createdAt'),
  );

  const [courses, loading, error] = useCollection(
    isTeacher ? teacherQuery : studentQuery,
  );

  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-gray-800 my-5 p-3">
          <div className="w-fit flex-col">
            <div className="flex mb-2 max-h-10 justify-center items-center">
              {isTeacher ? (
                <CourseCreation accountDoc={accountDoc} />
              ) : (
                <label className="block text-lg font-medium text-gray-900 dark:text-gray-300">
                  Курсы
                </label>
              )}
            </div>

            <div
              className={` max-w-screen-lg flex justify-center  xl:justify-start ${
                courses?.size === 1 && 'justify-center'
              }  flex-wrap`}
            >
              {error ? (
                <div>{error}</div>
              ) : loading ? (
                <Loading />
              ) : courses && courses.size > 0 ? (
                courses.docs.map(doc => {
                  return (
                    <Card
                      uRef={doc.ref}
                      key={doc.id}
                      title={doc.get('title')}
                      description={doc.get('description')}
                      imageURL={doc.get('imageURL')}
                      courseURL={doc.id}
                    />
                  );
                })
              ) : (
                'Сейчас тут пусто'
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
