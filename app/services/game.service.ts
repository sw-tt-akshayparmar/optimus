import * as apiService from "./api.service";
import * as userService from "./user.service";
import APIConfig from "~/config/api.config";
import Constants from "~/constants/constants";
import type { GameMatch } from "~/models/game/GameMatch.model";
import socket from "~/socket";
export async function startMatch(): Promise<GameMatch> {
  const payload = {
    connectionId: userService.getConnectionId(),
  };
  const res = await apiService.post(APIConfig.GAME_MATCH, payload);
  return res.data as GameMatch;
}

export function registerCallback(callback: (res: GameMatch) => void) {
  socket.on(Constants.MATCH_FOUND, callback);
}
