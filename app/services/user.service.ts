import storageConstants from "~/constants/storage.constants";
import type { LoginModel } from "~/models/Auth.model";
import { User } from "~/models/User.model";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";

export function saveAuthorization(token: string) {
  localStorage.setItem(storageConstants.AUTHORIZATION_TOKEN, token);
}

export function saveRefreshTone(token: string) {
  localStorage.setItem(storageConstants.REFRESH_TOKEN, token);
}

export function getAuthorazation(): string {
  return localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN) || "";
}

export function getRefreshToken(): string {
  return localStorage.getItem(storageConstants.REFRESH_TOKEN) || "";
}

export function getUserdata(): User {
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
  const data = await apiService.post(APIConfig.LOGIN, loginModel);
  return User.from(data);
}
