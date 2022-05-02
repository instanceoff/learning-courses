import React, { useEffect, useState } from 'react';
import Card from 'components/Card';
import Header from 'components/Header';
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  doc,
  where,
  getDocs,
} from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { auth, firestore } from 'api/firebase';
import Loading from 'components/Loading';
import Button from 'components/Button';
import { ITask } from 'types/course';
import { useAuthState } from 'react-firebase-hooks/auth';

const Courses = () => {
  const [courseTitle, setCourseTitle] = useState('');

  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  // let curUserDoc;

  // useEffect(() => {
  //   curUserDoc = userDoc;
  // }, [userDoc]);
  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  const [studentCourses, studentLoading, studentError] = useCollection(
    query(
      collection(firestore, 'courses'),
      where('groups', 'array-contains', userDoc?.get('group') || '0'),
      orderBy('createdAt'),
    ),
  );

  /*
  useEffect(() => {
    try {
      const q = query(
        collection(firestore, 'courses'),
        where('groups', 'array-contains', userDoc?.get('group') || '0'),
        orderBy('createdAt'),
      );

      const snapshot = getDocs(q);
    } catch (error) {
      console.log(error);
    }
  }, []);
  */

  const [teacherCourses, teacherLoading, teacherError] = useCollection(
    query(
      collection(firestore, 'courses'),
      where('teacher', '==', accountDoc),
      orderBy('createdAt'),
    ),
  );

  const courses = isTeacher ? teacherCourses : studentCourses;
  const loading = isTeacher ? teacherLoading : studentLoading;
  const error = isTeacher ? teacherError : studentError;

  const createNewCourse = async () => {
    await addDoc(collection(firestore, 'courses'), {
      title: courseTitle,
      teacher: accountDoc,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-gray-800 my-5 p-3">
          <div className="w-fit flex-col">
            {isTeacher && (
              <div className="flex mb-2 max-h-10">
                <div className=" xl:w-96 flex">
                  {/* <label className="form-label inline-block mb-2 text-gray-700">
                  Название
                </label> */}
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
        ml-2
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

                <Button title="Создать курс" onClick={createNewCourse} />

                {/* <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={createNewCourse}
              >
                Создать курс
              </button> */}
              </div>
            )}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
