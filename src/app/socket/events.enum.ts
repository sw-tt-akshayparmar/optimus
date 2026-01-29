export enum Events {
  CONNECT = 'connect',
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  SERVER_AUTH_SUCCESS = 'server.auth.success',
  SERVER_AUTH_FAILED = 'server.auth.failed',
  REGISTER_EVENT = 'register',
  UNREGISTER_EVENT = 'unregister',
  MESSAGE_EVENT = 'message',
  PRIVATE_CHAT = 'private.chat',
  OPPONENT_DISCONNECTED = 'opponent.disconnected',

  SHELL_IN = 'shell.in',
  SHELL_OUT = 'shell.out',

  GAME_MOVE = 'game.move',
  MATCH_FOUND = 'match.found',
  SERVER_ERR = 'server.err',
  CLIENT_ERR = 'client.err',
  SIO_AUTH = 'sio.auth',

  SIO_REQ = 'sio.req',
  SIO_RES = 'sio.res',
  NAT_REQ = 'nat.req',
  NAT_RES = 'nat.res',

  CHAT_JOIN = 'chat.join',
  CHAT_UP = 'chat.up',
  CHAT_DOWN = 'chat.down',
}
