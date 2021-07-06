import URL from './apiContstant';
import { SUCCESS_CODE, FAILURE_CODE } from 'utils';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
  getCompanies: async (params = { limit: 99999 }) => {
    try {
      const url = URL.GET_ALL_COMPANY_LIST;
      const response = await $http.get(url, params);

      return response;
    } catch (error) {
      return false;
    }
  },
  getBusinessCompanies: async (params = { limit: 99999 }) => {
    try {
      const url = URL.GET_BUSINESS_COMPANY_LIST;
      const response = await $http.get(url, params);

      return response;
    } catch (error) {
      return false;
    }
  },
  insertBusinessCompany: async (body) => {
    try {
      const url = URL.GET_BUSINESS_COMPANY_LIST;
      const response = await $http.post(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },
};
