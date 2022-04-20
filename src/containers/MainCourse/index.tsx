import { firestore, storage } from 'api/firebase';
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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type TMainCourse = {
  id?: string;
};

const MainCourse: React.FC<TMainCourse> = id => {
  const currentCourseId = document.location.pathname.slice(1);
  const currentCourseRef = doc(firestore, 'courses', currentCourseId);
  const [curCourse] = useDocument(currentCourseRef);

  // const [taskTitle, setTaskTitle] = useState('');
  // const [materialTitle, setMaterialTitle] = useState('');

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

  // const newTask: ITask = {
  //   course: currentCourseRef,
  //   title: taskTitle,
  //   description: '',
  //   id: '',
  // };

  const createNewTask = async task => {
    await addDoc(collection(firestore, 'tasks'), task);
  };

  // const [downloadUrl, setDownloadUrl] = useState('');

  // const fileHandler = addedFiles => {
  //   setFile(addedFiles);
  //   console.log(addedFiles[0]);
  // };

  // File upload and download
  const initialFileList: FileList = {
    length: 0,
    item: function (index: number): File | null {
      throw new Error('Function not implemented.');
    },
  };

  const [file, setFile] = useState(initialFileList);

  const filePush = async () => {
    if (file.length > 0) {
      const fileRef = await ref(
        storage,
        `materials/${currentCourseRef.id}/${file[0].name}`,
      );
      await uploadBytes(fileRef, file[0]).then(snapshot => {
        console.log('Файл загружен');
      });
      const downloadUrl = await getDownloadURL(fileRef);
      await addDoc(collection(firestore, 'materials'), {
        course: currentCourseRef,
        title: file[0].name,
        filePath: `materials/${currentCourseRef.id}/${file[0].name}`,
        downloadUrl: downloadUrl,
      });
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mx-2">
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-slate-800 mt-5 p-3">
          <div className="w-fit flex-col">
            <div className="flex mb-2 mx-2 max-h-10 justify-between items-center">
              <div>
                <input
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="user_avatar_help"
                  id="material_input"
                  type="file"
                  onChange={e => setFile(e.target.files!)}
                />
              </div>

              <Button title="Создать материал" onClick={filePush} />
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
                      course={currentCourseRef}
                      filePath={material?.get('filePath')}
                      downloadUrl={material?.get('downloadUrl')}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto rounded-lg bg-slate-100 dark:bg-slate-800  my-3 p-3">
          <div className="flex mb-2 mx-2 max-h-10">
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
