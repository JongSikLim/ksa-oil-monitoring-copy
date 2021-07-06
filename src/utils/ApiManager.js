import { deleteCookie, getCookie } from '.';
import { API_SERVER_URL } from 'utils';

/**
 * XHR통신 객체
 * --
 */
export default class ApiManager {
  /**
   * 생성자
   * --
   * @returns object
   */
  constructor() {
    // 싱글톤
    if (!ApiManager.instance) {
      ApiManager.instance = this;
    }

    return ApiManager.instance;
  }

  /*  */
  get = (url, params = null, authCheck = true) =>
    getRequest('GET', url, params, authCheck);
  delete = (url, params = null) => deleteRequest(url, 'DELETE', params);
  post = (url, body = null) => postOrPutRequest(url, 'POST', body);
  put = (url, body) => postOrPutRequest(url, 'PUT', body);
}

/**
 * 헤더값
 * --
 */
export let initialHeaders = () => {
  const token = getCookie('KSA_ACCESS_TOKEN');
  return {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;',
    ...(token && { Authorization: `${token}` }),
  };
};

/**
 * 상태코드 템플릿
 * --
 */
const resultCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * GET 요청 함수
 * --
 * @param {string} url
 * @param {object} params
 * @returns
 */
const getRequest = async (method = 'GET', url, params, authCheck) => {
  try {
    const headers = initialHeaders();
    const queryParameterString = jsonToQueryParameter(params);
    const combineUrl = `${API_SERVER_URL}${url}${queryParameterString}`;

    const response = await fetch(combineUrl, {
      method,
      headers,
    });

    const responseJson = await response.json();

    if (authCheck) {
      return _handleReponse(responseJson);
    } else {
      return responseJson;
    }
  } catch (error) {
    return {
      code: resultCode.INTERNAL_SERVER_ERROR,
      message: error,
    };
  }
};

/**
 * POST/PUT 요청 함수
 * --
 * @param {string} url
 * @param {string} method
 * @param {object} body
 * @returns
 */
const postOrPutRequest = async (url, method, body = {}) => {
  const bodyData = JSON.stringify(body);

  try {
    const headers = initialHeaders();
    const response = await fetch(`${API_SERVER_URL}${url}`, {
      method,
      headers,
      body: bodyData,
    });
    const responseJson = await response.json();

    // return responseJson;
    return _handleReponse(responseJson);
  } catch (error) {
    return {
      code: resultCode.INTERNAL_SERVER_ERROR,
      message: error,
    };
  }
};

/**
 * DELETE 요청 함수
 * --
 * @param {string} url
 * @returns
 */
const deleteRequest = async (url) => {
  console.log('url: ', url);
  try {
    const headers = initialHeaders();
    const response = await fetch(`${API_SERVER_URL}${url}`, {
      method: 'DELETE',
      headers,
    });
    const responseJson = await response.json();
    // return responseJson;
    return _handleReponse(responseJson);
  } catch (error) {
    return {
      code: resultCode.INTERNAL_SERVER_ERROR,
      message: error,
    };
  }
};

const _handleReponse = (response) => {
  if (response.hasOwnProperty('result')) {
    const {
      result: { status },
    } = response;

    if (status === 401) {
      window.location = '/';
      deleteCookie('KSA_ACCESS_TOKEN');
      return;
    }
  }

  return response;
};

/**
 * JSON to QueryParameters 변환함수
 * --
 * @param {object} params
 * @returns
 */
export const jsonToQueryParameter = (params) => {
  let queryPrameterUrlString = ``;

  if (params) {
    const keys = Object.keys(params);
    if (keys.length > 0) {
      for (let ii in keys) {
        queryPrameterUrlString += `&${keys[ii]}=${params[keys[ii]]}`;
      }
      return `?${queryPrameterUrlString.slice(1)}`;
    }
  } else {
    return '';
  }
};
