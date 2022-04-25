import { addDocument, addDocumentWithFiles } from 'api/document';
import { auth, firestore, storage } from 'api/firebase';
import Loading from 'components/Loading';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { IModal, ITask } from 'types/course';

interface IProps {
  task: ITask;
}

const ModalTask: React.FC<ITask> = ({
  uRef,
  id,
  title,
  description,
  files,
  course,
  multiply,
  addFiles,
  answer,
  children,
  onClick,
}) => {
  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);
  const [file, setFile] = useState('');
  const [taskDoc, loading, error] = useDocument(uRef);

  const fileHandler = addedFiles => {
    setFile(addedFiles[0].name);
    return addedFiles;
  };

  const [curAnswer, setCurAnswer] = useState('');
  const [curFiles, setCurFiles] = useState<FileList>();
  // const [curAnswer, setCurAnswer] = useState('');

  const [user, userLoading, userError] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  const [courseDoc, loadingCourrse, errorCourse] = useDocument(course);

  // const filePush = () => {
  //   const fileRef = ref(storage, `user/${file}`);
  //   uploadBytes(fileRef, fileHandler[0]).then(snapshot => {
  //     console.log('Файл загружен');
  //   });
  // };

  return (
    <div
      id={id}
      tabIndex={-1}
      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-7xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle={id}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6">
            {description && (
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}

            <div className="flex flex-col">
              <div className="flex">
                {loading ? (
                  <Loading />
                ) : (
                  taskDoc?.get('downloadPathes') &&
                  taskDoc?.get('downloadPathes').map((downloadPath, index) => {
                    const fileTitle = taskDoc
                      ?.get('filesPathes')
                      [index].split('/')[3];
                    return (
                      <a
                        download
                        href={`${downloadPath}`}
                        className="text-blue-700 hover:border-blue-700 dark:text-blue-500  "
                        title={`${fileTitle}`}
                      >
                        <div className="bg-white rounded-lg hover:text-white dark:hover:text-white  hover:bg-blue-700 dark:hover:bg-blue-700 hover:border-blue-700 border border-gray-200 shadow-md dark:bg-slate-800 dark:border-gray-700 m-2">
                          <div className="p-2">
                            <div className="flex justify-between  ">
                              <svg
                                className="w-6 h-6 "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </div>

            {addFiles && (
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  htmlFor="user_avatar"
                >
                  Загрузить файл
                </label>
                <input
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="user_avatar_help"
                  id="user_avatar"
                  type="file"
                  onChange={e => setCurFiles(e.target.files!)}
                />
              </div>
            )}
            {answer && (
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Ответ
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ваш ответ..."
                  onChange={e => setCurAnswer(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              data-modal-toggle={id}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={e =>
                addDocumentWithFiles(
                  'decisions',
                  {
                    task: uRef!,
                    title: title,
                    description: description!,
                    course: course,
                    user: accountDoc,
                    answer: curAnswer,
                    score: 0,
                    teacher: courseDoc?.get('teacher'),
                  },
                  curFiles!,
                )
              }
            >
              Отправить
            </button>
            <button
              data-modal-toggle={id}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTask;
