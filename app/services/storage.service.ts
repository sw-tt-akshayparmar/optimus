import storageConstants from "~/constants/storage.constants";

export function saveAuthorization(token: string) {
  localStorage.setItem(storageConstants.AUTHORIZATION_TOKEN, token);
}

export function getAuthorazation(): string {
  return localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN) || "";
}

export function saveConnectionId(connectionId: string) {
  localStorage.setItem(storageConstants.CONNECTION_ID, connectionId);
}

export function getConnectionId(): string {
  return localStorage.getItem(storageConstants.CONNECTION_ID) || "";
}
