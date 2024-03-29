import { addDocument, addTask } from 'api/document';
import { auth, firestore, storage } from 'api/firebase';
import Courses from 'containers/Courses';
import { DocumentReference, DocumentData, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { title } from 'process';
import React, {
  ChangeEventHandler,
  EventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { IModal, ITask } from 'types/course';

type CheckBox = {
  title: string;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckBoxVariant: React.FC<CheckBox> = ({ title, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        id="checkbox-1"
        aria-describedby="checkbox-1"
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        onChange={e => onChange(e.target.checked)}
      />
      <label
        htmlFor="checkbox-1"
        className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {title}
      </label>
    </div>
  );
};

type ModalCreate = {
  id: string;
  title: string;
  onClick?: (task: any) => Promise<void>;
  course: DocumentReference<DocumentData>;
};

const ModalTask: React.FC<ModalCreate> = ({ id, title, onClick, course }) => {
  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [answer, setAnswer] = useState(false);
  const [file, setFile] = useState(false);

  const initialFileList: FileList = {
    length: 0,
    item: function (index: number): File | null {
      throw new Error('Function not implemented.');
    },
  };

  const [files, setFiles] = useState(initialFileList);
  const filePath = 'user/task/fileName';

  const fileHandler = addedFiles => {
    setFile(addedFiles[0].name);
    return addedFiles;
  };

  const filePush = () => {
    const fileRef = ref(storage, `user/${file}`);
    uploadBytes(fileRef, fileHandler[0]).then(snapshot => {
      console.log('Файл загружен');
    });
  };

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
            <div className="mb-6">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Название
              </label>
              <input
                type="text"
                id="base-input"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Задание
              </label>
              <textarea
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Опишите здесь задание..."
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <input
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                id="user_avatar"
                type="file"
                onChange={e => setFiles(e.target.files!)}
                multiple
              />
            </div>
            <fieldset>
              <legend className="sr-only">Checkbox variants</legend>

              <CheckBoxVariant title="Письменный ответ" onChange={setAnswer} />

              <CheckBoxVariant
                title="К ответу необходимо приложить файл"
                onChange={setFile}
              />
            </fieldset>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              data-modal-toggle={id}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={e => {
                addTask(
                  course,
                  name,
                  description,
                  'tasks',
                  answer,
                  file,
                  files,
                );
                // addDocument('tasks', {
                //   id: id,
                //   title: name,
                //   description: description,
                //   addFiles: file,
                //   answer: answer,
                //   course: course,
                // });
              }}
            >
              Создать задание
            </button>
            <button
              data-modal-toggle={id}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTask;
