import URL from './apiContstant';
import { SUCCESS_CODE, FAILURE_CODE } from 'utils';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
  getCompanyParticular: async (companyId, params) => {
    try {
      const url = URL.GET_COMPANY_VESSEL_PARTICULAR.replace(
        ':companyId',
        companyId
      );
      const response = await $http.get(url, params);

      return response;
    } catch (error) {
      return false;
    }
  },

  getVesselParticular: async (shipId) => {
    try {
      const url = URL.GETnINSERT_VESSEL_PARTICULAR.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  insertVesselParticular: async (shipId, body) => {
    try {
      const url = URL.GETnINSERT_VESSEL_PARTICULAR.replace(':shipId', shipId);
      const response = await $http.post(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },

  updateVesselParticular: async (shipId, shipInfold, body) => {
    try {
      const url = URL.UPDATE_VESSEL_PARTICULAR.replace(
        ':shipId',
        shipId
      ).replace(':shipInfold', shipInfold);

      const response = await $http.put(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },

  getRecollectAisData: async (shipId) => {
    try {
      const url = URL.GET_RECOLLECT_AIS_DATA.replace(':shipId', shipId);

      const {
        result: { status, message },
      } = await $http.get(url);

      if (status === 200) {
        return message;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  getEngineParticular: async (shipId) => {
    try {
      const url = URL.GETnINSERT_ENGINE_PARTICULAR.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  insertEngineParticular: async (shipId, body) => {
    try {
      const url = URL.GETnINSERT_ENGINE_PARTICULAR.replace(':shipId', shipId);
      const response = await $http.post(url, body);
      const { info, rows, error } = response;

      if (error !== undefined) {
        throw new Error(error.message);
      }

      return response;
    } catch (error) {
      return false;
    }
  },

  updateEngineParticular: async (shipId, shipEngineId, body) => {
    try {
      const url = URL.UPDATE_ENGINE_PARTICULAR.replace(
        ':shipId',
        shipId
      ).replace(':shipEngineId', shipEngineId);
      const response = await $http.put(url, body);
      const { info, rows, error } = response;

      if (error !== undefined) {
        throw new Error(error.message);
      }

      return response;
    } catch (error) {
      return false;
    }
  },

  //SECTION 선속소모량 특성곡선
  getGRInfo: async (shipId) => {
    try {
      const url = URL.GR_TABLE_URL.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  insertGRFuelConsumption: async (shipId, body) => {
    try {
      const url = URL.GR_TABLE_URL.replace(':shipId', shipId);
      const response = await $http.post(url, body);

      const { info, rows, error } = response;

      if (error !== undefined) {
        throw new Error(error.message);
      }

      return response;
    } catch (error) {
      return false;
    }
  },

  updateGRFuelConsumption: async (shipId, body) => {
    try {
      const url = URL.GR_TABLE_URL.replace(':shipId', shipId);
      const response = await $http.put(url, body);

      const { info, rows, error } = response;

      if (error !== undefined) {
        throw new Error(error.message);
      }

      return response;
    } catch (error) {
      return false;
    }
  },

  getTAInfo: async (shipId) => {
    try {
      const url = URL.TA_TABLE_URL.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  getTAFerryInfo: async (shipId) => {
    try {
      const url = URL.TA_TABLE_FERRY_URL.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  insertTaInfo: async (shipId, body) => {
    try {
      const url = URL.INSERT_TA_INFO.replace(':shipId', shipId);
      const response = await $http.post(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },

  updateTaInfo: async (shipId, ferryShipId, body) => {
    try {
      const url = URL.UPDATE_TA_INFO.replace(':shipId', shipId).replace(
        ':ferryShipId',
        ferryShipId
      );
      const response = await $http.put(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },

  getFileList: async (shipId) => {
    try {
      const url = URL.GET_FILE_LIST.replace(':shipId', shipId);
      const response = await $http.get(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  // 파일 업로드
  uploadFile: async (shipId, files) => {
    try {
      const url = URL.UPLOAD_FILE.replace(':shipId', shipId);
      const response = await $http.post(url, files);

      return response;
    } catch (error) {
      return false;
    }
  },

  deleteFile: async (fileId) => {
    try {
      const url = URL.DELETE_FILE.replace(':fileId', fileId);
      const response = await $http.delete(url);

      return response;
    } catch (error) {
      return false;
    }
  },
};
