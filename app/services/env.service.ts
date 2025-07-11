import dotenv from "dotenv";
import EnvConstants from "~/constants/env.constants";
dotenv.config();

export function getEnvVariable(key: string) {
  return process.env[key] as string;
}

export function getServerUrl(): string {
  return getEnvVariable(EnvConstants.SERVER_URL);
}
export function getServerDomain(): string {
  return getEnvVariable(EnvConstants.SERVER_DOMAIN);
}
export function getServerPort(): string {
  return getEnvVariable(EnvConstants.SERVER_PORT);
}
export function getSocketioUrl(): string {
  return getEnvVariable(EnvConstants.SERVER_SOCKETIO_URL);
}
