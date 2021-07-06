import CONFIG from './config';

const deployType = process.env.REACT_APP_DEPLOY_TYPE
  ? process.env.REACT_APP_DEPLOY_TYPE
  : process.env.NODE_ENV;

export const envType = deployType;
// API URL
export const KSA_AUTH_URL = CONFIG[deployType]['KSA_AUTH_URL'];
export const API_SERVER_URL = CONFIG[deployType]['API_SERVER_URL'];
export const DOMAIN_URL = CONFIG[deployType]['DOMAIN_URL'];

// export { default as ApiManager } from './ApiManager';

// getCookie
export const getCookie = (name, options = null) => {
  const value = window.document.cookie.match(
    '(^|;) ?' + name + '=([^;]*)(;|$)'
  );
  return value ? value[2] : null;
};

// setCookie
export const setCookie = (name, value, expires = 1, callback = false) => {
  var date = new Date();
  date.setTime(date.getTime() + expires * 1000 * 60 * 60 * 24);
  window.document.cookie = `${name}=${value};expires=${date.toUTCString()}; path=/`;
  if (callback) callback();
};

// clearCookie
export const deleteCookie = (name, { path, domain }) => {
  console.log('쿠키 삭제');
  if (getCookie(name)) {
    window.document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

export const stringToMoneyFormat = (v = 0, unit = '') => {
  // const value = String(isNull(v) ? 0 : v)
  const value = String(v ? v : 0)
    .split('')
    .reverse()
    .join('');
  const valueLength = value.length;
  let result = '';
  for (let ii in value) {
    result += String(value[ii]);
    if ((ii + 1) % 3 === 0 && ii < valueLength - 1) {
      result += ',';
    }
  }
  return `${result.split('').reverse().join('')}${unit}`;
};
// API Status Code
export const SUCCESS_CODE = 200;
export const FAILURE_CODE = 400;
