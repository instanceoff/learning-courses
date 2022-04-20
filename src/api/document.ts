import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { firestore, storage } from './firebase';

// export const addFile = async (collectio, object, file) => {
//   await addDoc(collection(firestore, collectio), object);

//     if (file.length > 0) {
//       const fileRef = await ref(
//         storage,
//         `materials/${currentCourseRef.id}/${file[0].name}`,
//       );
//       await uploadBytes(fileRef, file[0]).then(snapshot => {
//         console.log('Файл загружен');
//       });
//       const downloadUrl = await getDownloadURL(fileRef);
//       await addDoc(collection(firestore, 'materials'), {
//         course: currentCourseRef,
//         title: file[0].name,
//         filePath: `materials/${currentCourseRef.id}/${file[0].name}`,
//         downloadUrl: downloadUrl,
//       });
//     }
// };

export const addDocument = async (collectio, object) => {
  await addDoc(collection(firestore, collectio), object);
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
  let filesRefs;
  if (files && files.length > 0) {
    const filesAr = await Array.from(files);
    filesAr.map(async (file, index) => {
      const fileRef = await ref(
        storage,
        `${collectionName}/${courseRef.id}/${file.name}`,
      );
      await uploadBytes(fileRef, file);
      filesRefs[index] = fileRef;
    });
    // for (let i = 0; i < files.length; i++) {
    //   const fileRef = await ref(
    //     storage,
    //     `${collectionName}/${courseRef.id}/${files[i].name}`,
    //   );
    //   await uploadBytes(fileRef, files[i]);
    // }
  }

  await addDoc(collection(firestore, collectionName), {
    title: title,
    description: description,
    course: courseRef,
    addFiles: addFiles,
    files: filesRefs ? filesRefs : 'no',
    answer: answer,
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
        filePath: `${collectionName}/${courseRef.id}/${files[i].name}`,
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
