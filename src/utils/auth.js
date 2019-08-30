const isBrowser = typeof window !== 'undefined';

const getUser = () => {
  if (window.localStorage.currentUser) {
    return JSON.parse(window.localStorage.currentUser);
  }

  return {};
};

const setUser = (user) => {
  window.localStorage.currentUser = JSON.stringify(user);
};

export const getLocalUser = () => isBrowser && getUser();
export const setLocalUser = ({ userId, userToken, organizationId }) => (
  isBrowser ? setUser({ userId, userToken, organizationId }) : false
);
export const clearLocalUser = () => {
  if (!isBrowser) return;

  setUser({});
};

export const isLocalTokenPresent = () => {
  if (!isBrowser) return false;

  const user = getUser();
  return !!user.userToken;
};

// Basic Authorization format:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
export const getAuthHeader = () => {
  if (!isLocalTokenPresent()) return false;

  const user = getUser();
  const authString = window.btoa(`${user.userId}:${user.userToken}`);
  return `Basic ${authString}`;
};

export const matchCurrentUserId = (id) => {
  if (!isBrowser) return false;

  const { userId } = getUser();
  return userId === id;
};
