import { produce } from 'immer';
import { setCookie } from 'utils';

const initialState = {
  companies: [],
  selectCompany: {
    name: '',
    ship: [],
  },
  serviceDataInfo: {
    totalCompany: null,
    totalShip: null,
  },
};

const SET_COMPANIES = 'COMPANY/SET_COMPANIES';
const SET_COMPANY = 'COMPANY/SET_COMPANY';
const SET_REMOTE_COMPANY = 'COMPANY/SET_REMOTE_COMPANY';
const SET_SERVICE_DATA_INFO = 'COMPANY/SET_SERVICE_DATA_INFO';
const UPDATE_COMPANY_SHIP = 'COMPANY/UPDATE_COMPANY_SHIP';

export const companyActions = {
  //비즈니스 선사 리스트 갱신
  setCompanies: (companies) => ({
    type: SET_COMPANIES,
    companies,
  }),

  //단일 선사 선택
  setCompany: (id, company) => ({
    type: SET_COMPANY,
    id,
    company,
  }),

  //서비스 정보
  setServiceData: (info) => ({ type: SET_SERVICE_DATA_INFO, info }),

  //선사 선박 리스트 수정
  updateCompanyShip: (companyId, rowIndex, key, value) => ({
    type: UPDATE_COMPANY_SHIP,
    companyId,
    rowIndex,
    key,
    value,
  }),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMPANIES:
      const { companies } = action;

      return produce(state, (draftState) => {
        draftState.companies = companies;
      });
    case SET_COMPANY: {
      const { id, company } = action;

      setCookie('companyId', id);

      return produce(state, (draftState) => {
        const targetCompanyIndex = draftState.companies.findIndex(
          (c) => c.companyId === id
        );

        draftState.companies[targetCompanyIndex] = company;
        draftState.selectCompany = company;
        // draftState.selectCompany = draftState.companies.find(
        //   (c) => c.companyId === id
        // );
      });
    }
    case SET_REMOTE_COMPANY:
      const { company } = action;

      return produce(state, (draftState) => {
        let target = draftState.companies.find(
          (c) => c.companyId === company.companyId
        );

        target = company;
        draftState.selectCompany = company;
      });
    case SET_SERVICE_DATA_INFO: {
      const { info } = action;
      return produce(state, (draftState) => {
        draftState.serviceDataInfo = info;
      });
    }
    case UPDATE_COMPANY_SHIP: {
      const { companyId, rowIndex, key, value } = action;

      return produce(state, (draftState) => {
        let targetCompany = draftState.companies.find(
          (c) => c.companyId === companyId
        );

        draftState.selectCompany.ship[rowIndex][key] = value;
        targetCompany.ship[rowIndex][key] = value;
      });
    }

    default:
      return state;
  }
};

export default reducer;
