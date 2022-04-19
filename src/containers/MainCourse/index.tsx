import { firestore } from 'api/firebase';
import MaterialsCard from 'components/MaterialsCard';
import Header from 'components/Header';
import Loading from 'components/Loading';
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { stringify } from 'querystring';
import React, { useState } from 'react';
import {
  useCollection,
  useDocument,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import TaskCard from 'components/TaskCard';
import Button from 'components/Button';
import { IMaterial, ITask } from 'types/course';
import ModalTask from 'components/ModalTask';
import ModalCreateTask from 'components/ModalCreateTask';

type TMainCourse = {
  id?: string;
};

const MainCourse: React.FC<TMainCourse> = id => {
  const currentCourseId = document.location.pathname.slice(1);
  const currentCourseRef = doc(firestore, 'courses', currentCourseId);

  const [taskTitle, setTaskTitle] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');

  const [curCourse] = useDocument(currentCourseRef);

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

  const newTask: ITask = {
    course: currentCourseRef,
    title: taskTitle,
    description: '',
    id: '',
  };

  const createNewTask = async task => {
    await addDoc(collection(firestore, 'tasks'), task);
  };

  const newMaterial: IMaterial = {
    course: currentCourseRef,
    title: materialTitle,
    description: '',
  };

  const createNewMaterial = async () => {
    await addDoc(collection(firestore, 'materials'), newMaterial);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-slate-800 mt-5 p-3">
          <div className="w-fit flex-col">
            <div className="flex mb-2 max-h-10">
              <Button title="Создать материал" onClick={createNewMaterial} />
            </div>
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
                    <MaterialsCard
                      key={material?.id}
                      title={material?.get('title')}
                      description={material?.get('description')}
                      course={currentCourseRef}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-slate-800  my-3 p-3">
          <div className="flex mb-2 max-h-10">
            <Button title="Добавить задание" modalId="addTask" />
            <ModalCreateTask
              id={'addTask'}
              title={'Добавить задание'}
              onClick={createNewTask}
              course={currentCourseRef}
            />
          </div>
          <div className="w-fit flex-col">
            <div
              className={` max-w-screen-lg flex justify-center  xl:justify-start ${
                tasks?.size === 1 && 'justify-center'
              }  flex-wrap`}
            >
              {tasksError ? (
                <div>{tasksError}</div>
              ) : tasksLoading ? (
                <Loading />
              ) : (
                tasks?.docs.map(task => {
                  return (
                    <>
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        answer={task.get('answer')}
                        addFiles={task.get('addFiles')}
                        title={task.get('title')}
                        description={task.get('description')}
                        course={currentCourseRef}
                      />
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
