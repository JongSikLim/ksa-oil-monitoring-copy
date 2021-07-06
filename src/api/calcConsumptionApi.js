import URL from './apiContstant';
import ApiManager from 'utils/ApiManager';
import MessageAlert from 'utils/MessageAlert';

const $http = new ApiManager();

export default {
  getCalcConsumptionSearch: async (shipId, start, end) => {
    try {
      const url = URL.GET_CALC_CONSUMPTION_SEARCH.replace(':shipId', shipId);
      const {
        result: { status },
        rows,
      } = await $http.get(url, {
        start,
        end,
      });
      if (status !== 200) {
        MessageAlert.warning('데이터 조회 실패!');
        return {
          status: false,
        };
      }

      return {
        status: true,
        data: rows,
      };
    } catch (error) {
      return { status: false };
    }
  },
  getCalcConsumptionPeriod: async (shipId, params) => {
    try {
      const url = URL.GET_CALC_CONSUMPTION_PERIOD.replace(':shipId', shipId);
      const {
        result: { status },
        rows,
      } = await $http.get(url, params);

      if (status !== 200) {
        MessageAlert.warning('데이터 조회 실패!');
        return {
          status: false,
        };
      }

      return {
        status: true,
        data: rows,
      };
    } catch (error) {
      console.log('error: ', error);

      return { status: false };
    }
  },
  insertCalcConsumptionPeriod: async (shipId, body) => {
    try {
      const url = URL.INSERT_CALC_CONSUMPTION_PERIOD.replace(':shipId', shipId);
      const {
        result: { status, message },
        rows,
      } = await $http.post(url, body);

      if (status !== 200) {
        MessageAlert.warning('데이터 저장 실패!');
        return {
          status: false,
          message,
        };
      }

      return {
        status: true,
        data: rows,
      };
    } catch (error) {
      return { status: false };
    }
  },
  updateCalcConsumptionPeriod: async (shipId, id, body) => {
    try {
      const url = URL.UPDATE_CALC_CONSUMPTION_PERIOD.replace(
        ':shipId',
        shipId
      ).replace(':id', id);
      const {
        result: { status, message },
        rows,
      } = await $http.put(url, body);

      if (status !== 200) {
        MessageAlert.warning('데이터 저장 실패!');
        return {
          status: false,
          message,
        };
      }

      return {
        status: true,
        data: rows,
      };
    } catch (error) {
      return { status: false };
    }
  },
  deleteCalcConsumptionPeriod: async (shipId, id) => {
    try {
      const url = URL.DELETE_CALC_CONSUMPTION_PERIOD.replace(
        ':shipId',
        shipId
      ).replace(':id', id);
      const {
        result: { status },
        rows,
      } = await $http.delete(url);

      if (status !== 200) {
        MessageAlert.warning('데이터 저장 실패!');
        return {
          status: false,
        };
      }

      return {
        status: true,
        data: rows,
      };
    } catch (error) {
      return { status: false };
    }
  },

  // 엑셀 레포트 다운로드
  downloadExcelReport: async (shipId, date) => {
    try {
      const url = URL.DOWNLOAD_CALC_CONSUMPTION_REPORT_EXCEL.replace(
        ':shipId',
        shipId
      );
      const response = await $http.get(url, { date });

      return response;
    } catch (error) {
      return false;
    }
  },

  // PDF 레포트 다운로드
  downloadPdfReport: async (shipId, date) => {
    try {
      const url = URL.DOWNLOAD_CALC_CONSUMPTION_REPORT_PDF.replace(
        ':shipId',
        shipId
      );
      const response = await $http.get(url, { date });

      return response;
    } catch (error) {
      return false;
    }
  },

  // 산출량 재계산
  reCalculationConsumptionInfo: async (shipId, date) => {
    try {
      const url = URL.RECALCULATION_CONSUMPTION_INFO.replace(':shipId', shipId);
      const {
        result: { status, message },
        rows,
      } = await $http.get(url, { date });

      if (status === 200) {
        return rows;
      } else {
        return false;
      }
    } catch (error) {}
  },
};
