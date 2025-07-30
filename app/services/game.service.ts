import Constants from "~/constants/constants";
import socket from "~/socket";
import * as apiService from "./api.service";
import * as storageService from "./storage.service";
import APIConfig from "~/config/api.config";

export async function startMatch() {
  const payload = {
    connectionId: storageService.getConnectionId(),
  };
  const data = await apiService.post(APIConfig.GAME_MATCH, payload);
  console.log(data);
}
