import storageConstants from "~/constants/storage.constants";
import { User } from "~/models/User.model";

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

export function saveConnectionId(connectionId: string) {
  localStorage.setItem(storageConstants.CONNECTION_ID, connectionId);
}

export function getConnectionId(): string {
  return localStorage.getItem(storageConstants.CONNECTION_ID) || "";
}

export function getUserdata(): User {
  return User.from(JSON.parse(localStorage.getItem(storageConstants.USER_DATA)!));
}
