import { auth, firestore } from 'api/firebase';
import Button from 'components/Button';
import ButtonDelete from 'components/ButtonDelete';
import { doc } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { IMaterial } from 'types/course';

const MaterialsCard: React.FC<IMaterial> = ({
  uRef,
  id,
  course,
  title,
  filePath,
  downloadUrl,
}) => {
  const defaultURL =
    'https://images.creativemarket.com/0.1.0/ps/7321584/1820/1210/m1/fpnw/wm1/zdut39gfcqxddqons5jttihib4dbljvx7fsw8l8iey2utfggkoy5gaou4eocsubf-.jpg?1574091458&s=0b3a91eab932d1643429fb9ffe314f4d';

  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  return (
    <div className="w-60 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-slate-700 dark:border-gray-800 m-2">
      {/* <a href="#">
        <img
          // w-full h-40
          className=" rounded-t-lg object-cover"
          src={imageURL ? imageURL : defaultURL}
          alt="Обложка курса"
        />
      </a> */}
      <div className="p-5">
        <div className="flex justify-between flex-col">
          <a download href={`${downloadUrl}`}>
            <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-ellipsis overflow-hidden">
              {title}
            </h6>
          </a>
          {isTeacher && (
            <ButtonDelete
              uRef={uRef!}
              modalId={id.slice(1, 2)}
              haveFile={true}
            />
          )}
        </div>
        {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description ? description : 'Описание отсутствует'}
      </p> */}
        {/* <Button title="Перейти к курсу" href={`/${courseURL}`} /> */}
        {/* <a
        href="/"
        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Перейти к курсу
        <svg
          className="ml-2 -mr-1 w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
        </svg>
      </a> */}
      </div>
    </div>
  );
};

export default MaterialsCard;
