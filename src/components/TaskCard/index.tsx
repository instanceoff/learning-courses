import { auth, firestore } from 'api/firebase';
import Button from 'components/Button';
import ButtonDelete from 'components/ButtonDelete';
import ModalTask from 'components/ModalTask';
import { doc } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { ITask } from 'types/course';

const TaskCard: React.FC<ITask> = ({
  uRef,
  id,
  title,
  description,
  course,
  answer,
  files,
  addFiles,
  multiply,
  onClick,
}) => {
  const defaultURL =
    'https://images.creativemarket.com/0.1.0/ps/7321584/1820/1210/m1/fpnw/wm1/zdut39gfcqxddqons5jttihib4dbljvx7fsw8l8iey2utfggkoy5gaou4eocsubf-.jpg?1574091458&s=0b3a91eab932d1643429fb9ffe314f4d';

  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const accountDoc = doc(firestore, 'accounts', user!.uid);
  const [userDoc, loadingDoc, errorDoc] = useDocument(accountDoc);
  const isTeacher = userDoc?.get('status') === 'teacher' ? true : false;

  return (
    <div className="w-60 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-slate-700 dark:border-gray-800 m-2">
      {/* <a href={`/${courseURL}`}>
        <img
          // w-full h-40
          className=" rounded-t-lg object-cover"
          src={imageURL ? imageURL : defaultURL}
          alt="Обложка курса"
        />
      </a> */}
      <div className="p-5">
        <a href=" #">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-ellipsis overflow-hidden">
            {title}
          </h5>
        </a>
        {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description ? description : 'Описание отсутствует'}
        </p> */}
        {/* <Button title="Открыть задание" href="#" /> */}

        <div className="flex justify-between w-full">
          <Button title="Открыть задание" modalId={id} />
          {isTeacher && (
            <ButtonDelete
              uRef={uRef!}
              modalId={id.slice(1, 2)}
              haveFile={false}
            />
          )}
        </div>
        <ModalTask
          id={id}
          title={title}
          answer={answer}
          addFiles={addFiles}
          description={description}
          course={course}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default TaskCard;
