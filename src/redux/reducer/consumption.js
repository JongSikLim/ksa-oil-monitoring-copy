import { produce } from 'immer';
import moment from 'moment';

const initialState = {
  consumptions: [],
  summary: {},
};

export const newConsumption = {
  reportMonth: null,
  carryOverOil: 0,
  supplyOil: 0,
  reportOil: 0,
  calculationOil: 0,
  operatingTime: 0,
  waitingTime: 0,
  flightDistance: 0,
  averageSpeed: 0,
  voyageSpend: 0,
  flightCount: 0,
  operatingMainEngine: 0,
  operatingSubEngine: 0,
  consumptionRate: 0,
  adequate: true,
  reason: '',
  files: [],
};

const SET_CONSUMPTIONS = 'CONSUMPTION/SET_CONSUMPTIONS';
const ADD_NEW_CONSUMPTION = 'CONSUMPTION/ADD_NEW_CONSUMPTION';
const SET_SUMMARY = 'CONSUMPTION/SET_SUMMARY';

export const consumptionActions = {
  setConsumptions: (consumptions) => ({ type: SET_CONSUMPTIONS, consumptions }),
  addNewConsumption: (requestYear, newConsumption) => ({
    type: ADD_NEW_CONSUMPTION,
    requestYear,
    newConsumption,
  }),
  setSummary: (summary) => ({
    type: SET_SUMMARY,
    summary,
  }),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // consumptions 데이터 삽입
    case SET_CONSUMPTIONS: {
      const { consumptions } = action;

      return produce(state, (draftState) => {
        draftState.consumptions = consumptions;
      });
    }
    // 새 consumption 객체 생성
    case ADD_NEW_CONSUMPTION: {
      return produce(state, (draftState) => {
        const { requestYear, newConsumption: consumption } = action;
        let prevReportMonth, newMonth;
        const length = draftState.consumptions.length;

        if (length >= 12) {
          return state;
        }

        if (length) {
          prevReportMonth = draftState.consumptions[length - 1].reportMonth;
          newMonth = moment(prevReportMonth).add(1, 'months').hour(0);
        } else {
          newMonth = moment(`${requestYear}-01`, 'YYYY-MM');
        }

        const _newConsumption = {
          ...consumption,
          reportMonth: newMonth.format('YYYY-MM-DDTHH:mm:ss'),
        };

        draftState.consumptions.push(_newConsumption);
      });
    }
    case SET_SUMMARY: {
      const { summary } = action;
      return produce(state, (draftState) => {
        draftState.summary = summary;
      });
    }
    default:
      return state;
  }
};

export default reducer;
