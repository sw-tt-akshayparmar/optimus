import environment from "environments/environments ";

export function getServerUrl(): string {
  return environment.SERVER_URL;
}
export function getServerDomain(): string {
  return environment.SERVER_DOMAIN;
}
export function getServerPort(): number {
  return environment.SERVER_PORT;
}
export function getSocketioUrl(): string {
  return environment.SERVER_SOCKETIO_URL;
}
export function getAPIBaseUrl(): string {
  return environment.API_BASE_URL;
}
