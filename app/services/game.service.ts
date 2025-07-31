import * as apiService from "./api.service";
import * as userService from "./user.service";
import APIConfig from "~/config/api.config";

export async function startMatch() {
  const payload = {
    connectionId: userService.getConnectionId(),
  };
  const data = await apiService.post(APIConfig.GAME_MATCH, payload);
  console.log(data);
}
