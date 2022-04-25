import { updateDocument } from 'api/document';
import { auth, firestore } from 'api/firebase';
import {
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { IDecision } from 'types/course';

interface IProps {
  decision?: QueryDocumentSnapshot<DocumentData>;
  decisionData?: IDecision;
}

const ModalDecision: React.FC<IProps> = ({ decision, decisionData }) => {
  useEffect(() => {
    window.document.dispatchEvent(new Event('DOMContentLoaded'));
  }, []);
  const [decisionDoc] = useDocument(decision?.ref);
  const [userDoc] = useDocument(decisionData?.user);
  const [score, setScore] = useState(decisionData?.score);

  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  const updateScore = () => {};

  return (
    <div
      id={decision?.id}
      tabIndex={-1}
      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-7xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="border-b dark:border-gray-600 p-5 rounded-t">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {decisionData?.title}
              </h3>

              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle={decision?.id}
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
            <div>
              <h4 className="text-l font-medium text-gray-400 dark:text-gray-200">
                {userDoc?.get('name')}
              </h4>
            </div>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6">
            {decision?.get('description') && (
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {decision?.get('description')}
              </p>
            )}
            {decisionData?.downloadPathes && (
              <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Приложеные файлы
                </label>
                <div className="flex">
                  {decisionData?.downloadPathes?.map((downloadPath, index) => {
                    const fileTitle = decisionData?.filesPathes
                      ?.at(index)!
                      .split('/')[3];
                    return (
                      <div className="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-slate-800 dark:border-gray-700 m-2">
                        <div className="p-2">
                          <div className="flex justify-between">
                            <a
                              download
                              href={`${decisionData.downloadPathes}`}
                              className="text-blue-700 hover:text-white dark:text-blue-500 dark:hover:text-white "
                              title={`${fileTitle}`}
                            >
                              <svg
                                className="w-6 h-6"
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
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {decisionData?.answer && (
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Ответ
                </label>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {decisionData.answer}
                </p>
              </div>
            )}
            {!isTeacher && (
              <label
                htmlFor="message"
                className="block text-lg font-medium text-gray-900 dark:text-gray-300"
              >
                Оценка: {decisionData?.score}
              </label>
            )}
          </div>
          {/* <!-- Modal footer --> */}

          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            {isTeacher && (
              <button
                data-modal-toggle={decision?.id}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={e => updateDocument(decision!.ref, { score: score })}
              >
                Отправить
              </button>
            )}

            <button
              data-modal-toggle={decision?.id}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Закрыть
            </button>
            {isTeacher && (
              <>
                <button
                  id="dropdownDefault"
                  data-dropdown-toggle={`dropdown${decision?.id}`}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {score === 0 ? 'Оценка' : score}
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
                  id={`dropdown${decision?.id}`}
                  className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefault"
                  >
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(1)}
                      >
                        1
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(2)}
                      >
                        2
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(3)}
                      >
                        3
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(4)}
                      >
                        4
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(5)}
                      >
                        5
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(6)}
                      >
                        6
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(7)}
                      >
                        7
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(8)}
                      >
                        8
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(9)}
                      >
                        9
                      </p>
                    </li>
                    <li>
                      <p
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={e => setScore(10)}
                      >
                        10
                      </p>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDecision;
