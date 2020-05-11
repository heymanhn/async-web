const isBrowser = typeof window !== 'undefined';

/* **** Current user data **** */

const getUser = () => {
  if (window.localStorage.currentUser) {
    return JSON.parse(window.localStorage.currentUser);
  }

  return {};
};

const setUser = user => {
  window.localStorage.currentUser = JSON.stringify(user);
};

export const getLocalUser = () => isBrowser && getUser();
export const setLocalUser = ({ userId, userToken }) =>
  isBrowser ? setUser({ userId, userToken }) : false;
export const clearLocalUser = () => {
  if (!isBrowser) return false;

  return setUser({});
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

export const matchCurrentUserId = id => {
  if (!isBrowser) return false;

  const { userId } = getUser();
  return userId === id;
};

/* **** Local app state **** */

const getAppState = () => {
  if (window.localStorage.appState) {
    return JSON.parse(window.localStorage.appState);
  }

  return {};
};

const setAppState = appState => {
  window.localStorage.appState = JSON.stringify(appState);
};

export const getLocalAppState = () => isBrowser && getAppState();
export const setLocalAppState = ({ organizationId, isOnboarding }) => {
  if (!isBrowser) return false;

  const appState = { ...getAppState() };
  if (organizationId !== undefined) appState.organizationId = organizationId;
  if (isOnboarding !== undefined) appState.isOnboarding = isOnboarding;

  return setAppState(appState);
};

export const isUserOnboarding = () => {
  if (!isBrowser) return false;

  const appState = getAppState();
  return !!appState.isOnboarding;
};

export const clearLocalAppState = () => {
  if (!isBrowser) return false;

  return setLocalAppState({});
};
