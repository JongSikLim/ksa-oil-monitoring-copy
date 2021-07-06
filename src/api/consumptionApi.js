import URL from './apiContstant';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
  // 연료유 데이터 조회
  getVesselConsumptionInfo: async (shipId, year) => {
    try {
      const url = URL.GET_VESSEL_CONSUMPTION_INFO.replace(':shipId', shipId);
      const response = await $http.get(url, { year });

      return response;
    } catch (error) {
      return false;
    }
  },

  // 연료유 등록
  insertVesselConsumptionInfo: async (shipId, body) => {
    try {
      const url = URL.INSERT_VESSEL_CONSUMPTION_INFO.replace(':shipId', shipId);
      const response = await $http.post(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },
  // 연료유 수정
  updateVesselConsumptionInfo: async (shipId, manageId, body) => {
    try {
      const url = URL.UPDATE_VESSEL_CONSUMPTION_INFO.replace(
        ':shipId',
        shipId
      ).replace(':manageId', manageId);
      const response = await $http.put(url, body);

      return response;
    } catch (error) {
      return false;
    }
  },
  // 연료유 삭제
  deleteVesselConsumptionInfo: async (shipId, manageId) => {
    try {
      const url = URL.DELETE_VESSEL_CONSUMPTION_INFO.replace(
        ':shipId',
        shipId
      ).replace(':manageId', manageId);
      const response = await $http.delete(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  // 첨부파일 삭제
  deleteFileVesselConsumptionRow: async (fileId) => {
    try {
      const url = URL.DELETE_ROW_ATTACHMENT_FILE.replace(':fileId', fileId);
      const response = await $http.delete(url);

      return response;
    } catch (error) {
      return false;
    }
  },

  // 엑셀 레포트 다운로드
  downloadExcelReport: async (shipId, start, end) => {
    try {
      const url = URL.DOWNLOAD_CONSUMPTION_INFO_REPORT_EXCEL.replace(
        ':shipId',
        shipId
      );
      const response = await $http.get(url, { start, end });

      return response;
    } catch (error) {
      return false;
    }
  },

  // pdf 레포트 다운로드
  downloadPdfReport: async (shipId, start, end) => {
    try {
      const url = URL.DOWNLOAD_CONSUMPTION_INFO_REPORT_PDF.replace(
        ':shipId',
        shipId
      );
      const response = await $http.get(url, { start, end });

      return response;
    } catch (error) {
      return false;
    }
  },
};
