import URL from './apiContstant';
import { SUCCESS_CODE, FAILURE_CODE } from 'utils';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
  getVessels: async (params = { limit: 99999 }) => {
    try {
      const url = URL.GET_ALL_VESSEL_LIST;
      const response = await $http.get(url, params);

      return response;
    } catch (error) {
      return false;
    }
  },
  insertVessels: async (body) => {
    try {
      const url = URL.INSERT_BUSINESS_VESSEL;
      const response = await $http.post(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },
  updateVesselManage: async (vesselId, body) => {
    try {
      const url = URL.UPDATE_VESSEL_MANAGE.replace(':shipId', vesselId);
      const response = await $http.put(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },
};
