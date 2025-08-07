import * as apiService from "./api.service";
import * as userService from "./user.service";
import APIConfig from "~/config/api.config";
import Constants from "~/constants/constants";
import type { GameMatch } from "~/models/game/GameMatch.model";
import socket, { SocketIO } from "~/socket";

export class GameClient {
  socket: SocketIO = socket;
  constructor() {}
  onMatchFound(callback: (res: GameMatch) => void) {
    this.socket.on(Constants.MATCH_FOUND, callback);
  }
  onOpponetDisconnect(callback: () => void) {
    this.socket.on(Constants.OPPONENT_DISCONNECTED, callback);
  }
  async startMatch(): Promise<GameMatch> {
    const payload = {
      connectionId: userService.getConnectionId(),
    };
    const res = await apiService.post(APIConfig.GAME_MATCH, payload);
    return res.data as GameMatch;
  }
}

const gameClient = new GameClient();

export default gameClient;
