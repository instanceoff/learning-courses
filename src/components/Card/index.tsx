import { auth, firestore } from 'api/firebase';
import Button from 'components/Button';
import ButtonDelete from 'components/ButtonDelete';
import { doc, DocumentData, DocumentReference } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';

type TCard = {
  title: string;
  description?: string | undefined;
  imageURL?: string | undefined;
  courseURL?: string;
  uRef?: DocumentReference<DocumentData>;
};

const Card: React.FC<TCard> = ({
  uRef,
  title,
  description,
  imageURL,
  courseURL,
}) => {
  const defaultURL =
    'https://images.creativemarket.com/0.1.0/ps/7321584/1820/1210/m1/fpnw/wm1/zdut39gfcqxddqons5jttihib4dbljvx7fsw8l8iey2utfggkoy5gaou4eocsubf-.jpg?1574091458&s=0b3a91eab932d1643429fb9ffe314f4d';

  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  return (
    <div className="w-60 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-slate-700 dark:border-gray-800 m-2">
      <a href={`/${courseURL}`}>
        <img
          // w-full h-40
          className=" rounded-t-lg object-cover"
          src={imageURL ? imageURL : defaultURL}
          alt="Обложка курса"
        />
      </a>
      <div className="p-5">
        <a href={`/${courseURL}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-ellipsis overflow-hidden">
            {title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description ? description : 'Описание отсутствует'}
        </p>
        <div className="flex justify-between w-full">
          <Button title="Перейти к курсу" href={`/${courseURL}`} />
          {isTeacher && (
            <ButtonDelete
              uRef={uRef!}
              modalId={uRef!.id.slice(1, 2)}
              haveFile={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
