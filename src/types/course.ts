import { DocumentData, DocumentReference } from 'firebase/firestore';
import { IUser } from './user';

export interface ITask {
  id: string;
  course?: DocumentReference<DocumentData>;
  title: string;
  description: string;
  files?: string[];
  multiply?: boolean;
}

export interface IMaterial {
  course: DocumentReference<DocumentData>;
  title: string;
  description: string;
  fileUrl?: string;
}

export interface ICourse {
  title: string;
  description: string;
  imageUrl?: string;
  groups?: string[];
  teachers?: DocumentReference<DocumentData>[];
}

export interface IDecision {
  course: DocumentReference<DocumentData>;
  task: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  answer?: string;
  answerFile?: string;
}
