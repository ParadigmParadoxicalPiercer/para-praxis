let ACCESS_TOKEN = null;

export function setAccessToken(token) {
  ACCESS_TOKEN = token || null;
}

export function getAccessToken() {
  return ACCESS_TOKEN;
}

export function clearAccessToken() {
  ACCESS_TOKEN = null;
}
