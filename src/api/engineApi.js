import URL from './apiContstant';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
  getMainEngines: async () => {
    try {
      const url = URL.GET_MAIN_ENGINE_LIST;
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },
  getSubMainEngines: async () => {
    try {
      const url = URL.GET_SUB_ENGINE_LIST;
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },
};
