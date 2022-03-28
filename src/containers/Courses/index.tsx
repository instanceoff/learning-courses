import React, { useState } from 'react';
import Card from 'components/Card';
import Header from 'components/Header';
import { collection, addDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { firestore } from 'api/firebase';
import Loading from 'components/Loading';

const Courses = () => {
  const [courses, loading, error] = useCollection(
    collection(firestore, 'courses'),
  );

  const [courseTitle, setCourseTitle] = useState('');

  const createNewCourse = async () => {
    await addDoc(collection(firestore, 'courses'), {
      title: courseTitle,
    });
  };

  return (
    <>
      <Header />
      <div className="flex mx-2">
        <div className="mx-auto rounded-lg bg-slate-300 my-5 p-3">
          <div className="w-fit flex-col">
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

              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={createNewCourse}
              >
                Создать курс
              </button>
            </div>
            <div className=" max-w-screen-lg w-fit flex justify-between flex-wrap">
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
        </div>
      </div>
    </>
  );
};

export default Courses;
