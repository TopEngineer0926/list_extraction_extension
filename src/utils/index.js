const USER_INFO = "user_info";
const LOGGED_IN = "logged_in";

export const addAuthorizationUserInfo = (userInfo) => {
  window.localStorage.setItem(USER_INFO, userInfo);
};

export const addLoggedIn = (logged_in) => {
  window.localStorage.setItem(LOGGED_IN, logged_in);
};

export const removeAuthorizationUserInfo = () => {
  window.localStorage.removeItem(USER_INFO);
  window.localStorage.removeItem(LOGGED_IN);
};

export const getUserInfo = () => {
  let user_info = window.localStorage.getItem(USER_INFO);
  return user_info;
};

export const getLoggedIn = () => {
  let logged_in = window.localStorage.getItem(LOGGED_IN);
  return logged_in;
};
