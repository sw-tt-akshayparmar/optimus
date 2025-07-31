import { User } from "./User.model";

export interface LoginModel {
  username: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  user?: User;
}
