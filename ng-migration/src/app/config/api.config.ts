const APIConfig = {
  API_ROOT: {
    path: '/api',
  },
  REGISTER: {
    path: '/auth/register',
  },
  LOGIN: {
    path: '/auth/login',
  },
  GAME_MATCH: {
    path: '/game/match',
    auth: true,
  },
  SHELL: {
    path: '/shell',
    auth: true,
  },
  PROJECTS: {
    path: '/projects',
    auth: true,
  },
};

export default APIConfig;
