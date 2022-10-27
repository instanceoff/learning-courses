import { auth, firestore, storage } from 'api/firebase';
import MaterialsCard from 'components/CardMaterials';
import Header from 'components/Header';
import Loading from 'components/Loading';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import {
  useCollection,
  useDocument,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import TaskCard from 'components/CardTask';
import Button from 'components/Button';
import { IMaterial, ITask } from 'types/course';
import ModalTask from 'components/ModalTask';
import ModalCreateTask from 'components/ModalCreateTask';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDocument, addMaterials, updateDocument } from 'api/document';
import { useAuthState } from 'react-firebase-hooks/auth';

type TMainCourse = {
  id?: string;
};

const MainCourse: React.FC<TMainCourse> = ({ id }) => {
  // useEffect(() => {
  //   window.document.dispatchEvent(new Event('DOMContentLoaded'));
  // }, []);
  const currentCourseId = document.location.pathname.slice(1);
  const currentCourseRef = doc(firestore, 'courses', currentCourseId);
  const [curCourse] = useDocument(currentCourseRef);

  const [user, loading, error] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;
  const [newGroup, setNewGroup] = useState('');

  const [tasks, tasksLoading, tasksError] = useCollection(
    query(
      collection(firestore, 'tasks'),
      where('course', '==', currentCourseRef),
    ),
  );
  const [materials, materialsLoading, materialsError] = useCollection(
    query(
      collection(firestore, 'materials'),
      where('course', '==', currentCourseRef),
    ),
  );

  // File upload and download
  const initialFileList: FileList = {
    length: 0,
    item: function (index: number): File | null {
      throw new Error('Function not implemented.');
    },
  };

  const [files, setFiles] = useState(initialFileList);

  const addNewGroup = async () => {
    if (newGroup)
      await updateDocument(curCourse!.ref, { groups: arrayUnion(newGroup) });
  };

  const deleteGroup = async group => {
    if (group)
      await updateDocument(curCourse!.ref, { groups: arrayRemove(group) });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-slate-800 mt-5 p-3">
          <div className="flex w-fit flex-col justify-end items-center">
            {loading || loadingDoc ? (
              <Loading />
            ) : isTeacher ? (
              <div className="flex mb-2 mx-2 max-h-10 justify-between items-center">
                <div className="mr-4">
                  <input
                    className="block mr-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="user_avatar_help"
                    id="material_input"
                    type="file"
                    onChange={e => setFiles(e.target.files!)}
                    multiple
                  />
                </div>

                <Button
                  title="Добавить материал"
                  onClick={e =>
                    addMaterials(currentCourseRef, files, 'materials')
                  }
                />
              </div>
            ) : (
              <label className="block text-lg font-medium text-gray-900 dark:text-gray-300">
                Учебные материалы
              </label>
            )}
            <div
              className={` max-w-screen-lg flex justify-center  xl:justify-start ${
                tasks?.size === 1 && 'justify-center'
              }  flex-wrap`}
            >
              {materialsError ? (
                <div>{materialsError}</div>
              ) : materialsLoading ? (
                <Loading />
              ) : (
                materials?.docs.map(material => {
                  return (
                    <div className="m-2">
                      <MaterialsCard
                        uRef={material.ref}
                        id={material.id}
                        key={material?.id}
                        title={material?.get('title')}
                        course={currentCourseRef}
                        filePath={material?.get('filePath')}
                        downloadUrl={material?.get('downloadUrl')}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mx-auto rounded-lg bg-slate-100 dark:bg-slate-800  my-3 p-3">
          {isTeacher ? (
            <div className="flex justify-end w-full mb-2 mx-2 max-h-10">
              <button
                id="dropdownDefault"
                data-dropdown-toggle={`dropdowngroup`}
                className="text-white mr-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Группы
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                id={`dropdowngroup`}
                className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefault"
                >
                  {curCourse?.get('groups')?.map(group => {
                    return (
                      <li className="flex py-2 px-4 items-center justify-between ">
                        <p className="block  ">{group}</p>
                        <svg
                          className="w-6 h-6 rounded-md hover:text-white hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={e => deleteGroup(group)}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </li>
                    );
                  })}
                  <li className="px-3">
                    <div className="flex flex-col">
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
       mb-2
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                        id="courseTitleInput"
                        placeholder="Номер группы"
                        onChange={e => {
                          setNewGroup(e.target.value);
                        }}
                      />
                      <div className="text-center">
                        <Button title="Добавить группу" onClick={addNewGroup} />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <Button title="Добавить задание" modalId="addTask" />
              <ModalCreateTask
                id={'addTask'}
                title={'Добавить задание'}
                // onClick={addDocument}
                course={currentCourseRef}
              />
            </div>
          ) : (
            <label className="block text-lg font-medium text-gray-900 dark:text-gray-300">
              Учебные задания
            </label>
          )}
          <div className="w-fit flex-col">
            <div
              className={` max-w-screen-lg flex justify-center flex-wrap xl:justify-start ${
                tasks?.size === 1 && 'justify-center'
              }  `}
            >
              {tasksError ? (
                <div>{tasksError}</div>
              ) : tasksLoading ? (
                <Loading />
              ) : (
                tasks?.docs.map(task => {
                  return (
                    <>
                      <div className="m-2">
                        <TaskCard
                          uRef={task.ref}
                          key={task.id}
                          id={task.id}
                          answer={task.get('answer')}
                          addFiles={task.get('addFiles')}
                          title={task.get('title')}
                          description={task.get('description')}
                          course={currentCourseRef}
                        />
                      </div>
                    </>
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

export default MainCourse;
