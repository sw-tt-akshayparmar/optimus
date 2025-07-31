const APIConfig = {
  API_ROOT: {
    path: "/api",
  },
  REGISTER: {
    path: "/auth/register",
  },
  LOGIN: {
    path: "/auth/login",
  },
  GAME_MATCH: {
    path: "/game/match",
    auth: true,
  },
};

export default APIConfig;
