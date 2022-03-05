export enum EStatus {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export interface IUser {
  name: string;
  group: string | null;
  status: EStatus;
}
