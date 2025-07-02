import { User } from "./user.interface";

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
