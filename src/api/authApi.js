import { setCookie, getCookie, deleteCookie } from 'utils';
import ApiManager from 'utils/ApiManager';
import MessageAlert from 'utils/MessageAlert';
import URL from './apiContstant';

const $http = new ApiManager();

export default {
  signin: async (userInfo) => {
    const url = URL.KSA_AUTH_SERVE_URL;
  },

  /**
   * 로그인API
   * --
   * @param {*} userInfo
   * @returns Boolean
   */
  signinTest: async (userInfo) => {
    try {
      const {
        result: { status },
        rows, // {token}
      } = await $http.post(URL.LOGIN, userInfo);
      if (status !== 200) {
        MessageAlert.warning('계정정보를 확인해 주세요');
        return {
          status: false,
        };
      }

      MessageAlert.success('접속되었습니다.');
      // 토큰저장
      setCookie('KSA_ACCESS_TOKEN', rows.token);
      return {
        status: true,
        data: rows,
      };
    } catch (e) {
      MessageAlert.error('페이지를 새로고침 해주세요.');
      return {
        status: false,
      };
    }
  },

  /**
   * 인증체크
   * --
   */
  sessionVerification: async () => {
    try {
      const {
        result: { status },
        rows,
      } = await $http.get(`/user/authenticate`, null, false);

      if (status === 200) {
        return rows;
      } else {
        return false;
      }
    } catch (e) {
      console.log('e: ', e);
      return false;
    }
  },
};
