import { IUser } from './user';

export interface IAnswer {
  isComplete: boolean;
  answer: string | IUser;
}
