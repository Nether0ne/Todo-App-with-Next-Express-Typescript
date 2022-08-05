export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

export interface UserRegister {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoggedInUser extends User {
  token: string;
}
