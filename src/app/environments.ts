const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';

const protocol = isBrowser ? window.location.protocol : 'http:';
const hostname = isBrowser ? window.location.hostname : 'localhost';
const portStr = isBrowser ? window.location.port : (process.env['PORT']?.toString?.() ?? '');
const defaultPort = protocol === 'https:' ? 443 : 4000;
const port = portStr ? Number(portStr) : defaultPort;

function buildOrigin(proto: string, host: string, p?: number | string) {
  const pStr = p?.toString();
  if (!pStr || (proto === 'https:' && pStr === '443') || (proto === 'http:' && pStr === '80')) {
    return `${proto}//${host}`;
  }
  return `${proto}//${host}:${pStr}`;
}

const SERVER_URL = buildOrigin(protocol, hostname, portStr || port);
const SOCKET_PROTOCOL = protocol === 'https:' ? 'wss:' : 'ws:';
const SERVER_SOCKETIO_URL = buildOrigin(SOCKET_PROTOCOL, hostname, portStr || port);
const API_BASE_URL = `${SERVER_URL}/api`;

const environments = {
  SERVER_URL,
  SERVER_DOMAIN: hostname,
  SERVER_PORT: port,
  SERVER_SOCKETIO_URL,
  API_BASE_URL,
};

export default environments;
