export interface Task {
  id: number;
  title: string;
  waitingToBeAdded?: boolean;
  waitingToBeDeleted?: boolean;
}