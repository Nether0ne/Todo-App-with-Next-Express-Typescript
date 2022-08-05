export interface Todo {
  id: number;
  description: string;
  color: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoEdit {
  id: number;
  description: string;
  color: string;
  completed: boolean;
}

export interface TodoAdd {
  description: string;
  color: string;
}
