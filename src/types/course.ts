import { DocumentData, DocumentReference } from 'firebase/firestore';
import { MouseEventHandler } from 'react';
import { IUser } from './user';

export interface IModal {
  id: string;
  title: string;
  description: string;
  course?: DocumentReference<DocumentData>;
  files?: string[];
  multiply?: boolean;
}

export interface ITask {
  uRef?: DocumentReference<DocumentData>;
  id: string;
  title: string;
  description?: string;
  course: DocumentReference<DocumentData>;
  addFiles?: boolean;
  multiply?: boolean;
  files?: DocumentReference<DocumentData>[];
  answer?: boolean;
  onClick?: (task: any) => Promise<void>;
}

export interface IDecision {
  uRef?: DocumentReference<DocumentData>;
  course?: DocumentReference<DocumentData>;
  task: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  answer?: string;
  answerFiles?: string[];
  title?: string;
  description: string;
  score: number;
  // files?: DocumentReference<DocumentData>[];
  // onClick?: (task: any) => Promise<void>;
}

export interface IMaterial {
  uRef: DocumentReference<DocumentData>;
  id: string;
  course: DocumentReference<DocumentData>;
  title: string;
  filePath?: string;
  downloadUrl?: string;
}

export interface ICourse {
  title: string;
  description: string;
  imageUrl?: string;
  groups?: string[];
  teachers?: DocumentReference<DocumentData>[];
}
