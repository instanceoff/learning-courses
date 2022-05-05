import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  DocumentData,
  DocumentReference,
  getDoc,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from 'firebase/storage';
import { IDecision, ITask, TDocuments } from 'types/course';
import { firestore, storage } from './firebase';

export const getDecisionsData = async documentRef => {
  await getDoc(documentRef).then();
};

export const addDocument = async (collectionName, documentData) => {
  await addDoc(collection(firestore, collectionName), documentData);
};

export const updateDocument = async (
  documentRef: DocumentReference<DocumentData>,
  documentData,
) => {
  await updateDoc(documentRef, documentData);
};

export const addDocumentWithFiles = async (
  collectionName: string,
  documentData: IDecision,
  files: FileList,
) => {
  const newDocRef = await addDoc(
    collection(firestore, collectionName),
    documentData,
  );
  if (files && files.length > 0) {
    const filesAr = await Array.from(files!);
    await filesAr.map(async file => {
      const fileRef = await ref(
        storage,
        `${collectionName}/${documentData.course?.id}/${newDocRef.id}/${file.name}`,
      );
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      updateDoc(newDocRef, {
        filesPathes: arrayUnion(fileRef.fullPath),
        downloadPathes: arrayUnion(downloadUrl),
      });
    });
  }
};

export const addTask = async (
  courseRef: DocumentReference<DocumentData>,
  title: string,
  description: string,
  collectionName: string,
  answer: boolean,
  addFiles: boolean,
  files?: FileList,
) => {
  const newTaskRef = await addDoc(collection(firestore, collectionName), {
    title: title,
    description: description,
    course: courseRef,
    addFiles: addFiles,
    answer: answer,
  });

  const filesAr = await Array.from(files!);
  await filesAr.map(async file => {
    const fileRef = await ref(
      storage,
      `${collectionName}/${courseRef.id}/${newTaskRef.id}/${file.name}`,
    );
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    updateDoc(newTaskRef, {
      filesPathes: arrayUnion(fileRef.fullPath),
      downloadPathes: arrayUnion(downloadUrl),
    });
  });
};

export const addMaterials = async (courseRef, files, collectionName) => {
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const fileRef = await ref(
        storage,
        `${collectionName}/${courseRef.id}/${files[i].name}`,
      );
      await uploadBytes(fileRef, files[i]);
      const downloadUrl = await getDownloadURL(fileRef);
      await addDoc(collection(firestore, collectionName), {
        course: courseRef,
        title: files[i].name,
        filesPathes: arrayUnion(
          `${collectionName}/${courseRef.id}/${files[i].name}`,
        ),
        downloadUrl: downloadUrl,
      });
    }
  }
};

export const deleteDocument = async (uRef: DocumentReference<DocumentData>) => {
  await deleteDoc(uRef);
};

export const deleteDocumentAndFile = async (
  uRef: DocumentReference<DocumentData>,
) => {
  await deleteObject(ref(storage, (await getDoc(uRef)).get('filePath')));
  await deleteDoc(uRef);
};

export const deleteDocumentAndFiles = async (
  uRef: DocumentReference<DocumentData>,
) => {
  const filesPathes = await (await getDoc(uRef)).get('filesPathes');
  await filesPathes.map(async filePath => {
    await deleteObject(ref(storage, filePath));
  });
  await deleteDoc(uRef);
};

export const decisionConverter = (
  props: QueryDocumentSnapshot<DocumentData>,
): IDecision => {
  return {
    task: props.get('task'),
    description: props.get('description'),
    score: props.get('score'),
    user: props.get('user'),
    answer: props.get('answer'),
    course: props.get('course'),
    courseName: props.get('courseName'),
    downloadPathes: props.get('downloadPathes'),
    filesPathes: props.get('filesPathes'),
    title: props.get('title'),
    uRef: props.get('uRef'),
    teacher: props.get('teacher'),
  };
};
