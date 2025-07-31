import storageConstants from "~/constants/storage.constants";
import type { AuthToken, LoginModel } from "~/models/Auth.model";
import { User } from "~/models/User.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import type { ErrorResponse, SuccessResponse } from "~/models/Response.model";

export function saveAuthorization(token: string) {
  localStorage.setItem(storageConstants.AUTHORIZATION_TOKEN, token);
}

export function saveRefreshToken(token: string) {
  localStorage.setItem(storageConstants.REFRESH_TOKEN, token);
}

export function getAuthorazation(): string {
  return localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN) || "";
}

export function getRefreshToken(): string {
  return localStorage.getItem(storageConstants.REFRESH_TOKEN) || "";
}

export function saveUserData(user: User) {
  localStorage.setItem(storageConstants.USER_DATA, JSON.stringify(user));
}

export function getUserData(): User {
  return User.from(JSON.parse(localStorage.getItem(storageConstants.USER_DATA)!));
}

export function saveConnectionId(connectionId: string) {
  localStorage.setItem(storageConstants.CONNECTION_ID, connectionId);
}

export function getConnectionId(): string {
  return localStorage.getItem(storageConstants.CONNECTION_ID) || "";
}

export async function register(user: User) {
  apiService.post(APIConfig.REGISTER, user);
}

export async function login(loginModel: LoginModel): Promise<User> {
  const success: SuccessResponse | ErrorResponse = await apiService.post(
    APIConfig.LOGIN,
    loginModel
  );
  const auth: AuthToken = success.data as AuthToken;
  saveAuthorization(auth.accessToken);
  saveRefreshToken(auth.refreshToken);
  saveUserData(auth.user!);
  console.log(success);
  return auth.user!;
}
