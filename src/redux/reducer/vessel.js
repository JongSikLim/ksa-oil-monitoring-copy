import { produce } from 'immer';
import moment from 'moment';
import { setCookie } from 'utils';
import { getObjectSize } from 'utils/esManager';
import { vessel } from '.';

const initialState = {
  vessels: [],
  selectVessel: {
    shipId: 0,
  },
  particulars: [],
  selectParticular: {},
  particular: {
    sh: {
      basic: {
        shipInfoId: 0,
        name: null,
        kind_1: null,
        kind_2: null,
        code: null,
        manageCode: null,
        isAIS: null,
        typeAIS: null,
        fairWay_1: '',
        fairWay_2: '',
      },
      particular: {
        length: null,
        width: null,
        depth: null,
        weight: null,
        speedAverage: null,
        speedMaximum: null,
        mmsi: '',
        mmsiStart: '',
      },
    },
    en: {
      shipEngineId: 0,
      shipId: 0,
      speedAverage: 0,
      speedMaximum: 0,
      mainEngineCompany: null,
      mainEngineModel: null,
      mainEngineLoad: null,
      mainEnginePower: null,
      mainEngineUnit: null,
      mainEngineAmount: null,
      mainEngineOutput: 0,
      mainEngineConsumptionLoad: 0,
      mainEngineConsumptionRate: 0,
      mainEngineConsumption: 0,
      subEngineCompany: null,
      subEngineModel: null,
      subEnginePower: null,
      subEngineUnit: null,
      subEngineAmount: null,
      subEngineOutput: 0,
      subEngineConsumptionLoad: 0,
      subEngineConsumption: 0,
      voyageMainEngineFuel: null, // 도선용
      voyageSubEngineFuel: null, // 도선용
    },
    gr: {
      originRate: 0,
      dataStatus: '',
      dataRate: 100,
    },
    ta: {
      company: {
        companyId: null,
        companyCode: null,
        name: null,
        chief: null,
        companyNumber: null,
        corporateNumber: null,
        address: null,
        addressDetail: null,
      },
      ship: {
        shipId: null,
        shipInfoId: null,
        name: null,
        kind_1: null,
        kind_2: null,
        code: null,
        manageCode: null,
        isAIS: null,
        fairWay_1: null,
        fairWay_2: null,
        length: null,
        width: null,
        depth: null,
        weight: null,
        speedAverage: null,
        speedMaximum: null,
        mmsi: null,
      },
      mainEngine: {
        shipEngineId: null,
        manufacturer: null,
        mainEngineId: null,
        model: null,
        averageLoad: null,
        power: null,
        unit: null,
        amount: null,
        consumption: [
          {
            load: null,
            speed: null,
            kw: null,
            fuelConsumptionRate: null,
            fuelConsumption: null,
          },
          {},
          {},
          {},
          {},
        ],
      },
      subEngine: {
        shipEngineId: null,
        manufacturer: null,
        subEngineId: null,
        model: null,
        power: null,
        unit: null,
        amount: null,
        consumption: {
          subEngineLoad: null,
          subEngineFuel: null,
        },
      },
      ferry: {
        ferryShipId: 0,
        shipId: 0,
        flightFairway: '',
        flightDistance: 0,
        flightCount: 0,
        flightNote: 0,
        sailingTime: 0,
        waitingTime: 0,
        totalTime: 0,
        engineName: '',
        mainEnginePower: 0,
        subEnginePower: 0,
        mainSailingSpend: 0,
        mainSailingOil: '',
        mainWaitingSpend: 0,
        mainWaitingOil: '',
        mainSailingVoyageSpend: 0,
        mainWaitingVoyageSpend: 0,
        subSpend: 0,
        subVoyageSpend: 0,
        subOil: '',
        totalMainSpend: 0,
        totalMainVoyageSpend: 0,
        totalSpend: 0,
        totalVoyageSpend: 0,
      },
    },
  },
  files: [],
  uploadingFile: null,
  isFerry: false,
};

const SET_VESSELS = 'VESSEL/SET_VESSELS';
const SET_VESSEL = 'VESSEL/SET_VESSEL';
const SET_PARTICULARS = 'VESSEL/SET_PARTICULARS';
const SET_PARTICULAR = 'VESSEL/SET_PARTICULAR';
const SET_SH = 'VESSEL/SET_SH';
const SET_EN = 'VESSEL/SET_EN';
const SET_GR = 'VESSEL/SET_GR';
const SET_ORIGIN_GR = 'VESSEL/SET_ORIGIN_GR';
const SET_FERRY = 'VESSEL/SET_FERRY';
const SET_TA = 'VESSEL/SET_TA';
const SET_TA_INIT = 'VESSEL/SET_TA_INIT';
const SET_TA_COMPANY_INIT = 'VESSEL/SET_TA_COMPANY_INIT';
const SET_TA_FERRY = 'VESSEL/SET_TA_FERRY';
const SET_TA_FIELD_CHANGE = 'VESSEL/SET_TA_FIELD_CHANGE';
const INIT_PARTICULAR = 'VESSEL/INIT_PARTICULAR';
const SET_FILES = 'VESSEL/SET_FILES';
const UPLOAD_FILE = 'VESSEL/UPLOAD_FILE';

export const vesselActions = {
  setVessels: (vessels) => ({ type: SET_VESSELS, vessels }),
  setVessel: (vesselId) => ({ type: SET_VESSEL, id: vesselId }),
  setParticulars: (particulars) => ({
    type: SET_PARTICULARS,
    particulars,
  }),
  setParticular: (id) => ({ type: SET_PARTICULAR, id }),
  setSh: (data) => ({ type: SET_SH, data }),
  setEn: (data) => ({ type: SET_EN, data }),
  setGr: (data) => ({ type: SET_GR, data }),
  setOriginGr: (data) => ({ type: SET_ORIGIN_GR, data }),
  setTaCompanyInit: (data) => ({ type: SET_TA_COMPANY_INIT, data }), // 선사변경되면 선사부분만 변경
  setTaInit: (vesselParticular, engineParticular, company) => ({
    // 선박 변경됐을 때, ship, engine 데이터 받아서 할당
    type: SET_TA_INIT,
    vesselParticular,
    engineParticular,
    company,
  }),
  setTa: (data) => ({ type: SET_TA, data }), // (도선외) 받은 데이터 shipTaID 체크후 그대로 할당
  setTAFerry: (data) => ({ type: SET_TA_FERRY, data }), // (도선) 데이터
  setFerry: (data) => ({ type: SET_FERRY, data }),
  setTaFieldChange: (data) => ({ type: SET_TA_FIELD_CHANGE, data }),
  initParticular: () => ({ type: INIT_PARTICULAR }),
  setFiles: (files) => ({ type: SET_FILES, files }),
  uploadFile: (data) => ({ type: UPLOAD_FILE, data }),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VESSELS:
      const { vessels } = action;

      return produce(state, (draftState) => {
        draftState.vessels = vessels;
      });
    case SET_VESSEL:
      const { id } = action;

      return produce(state, (draftState) => {
        draftState.selectVessel = draftState.vessels.find((v) => {
          return v.shipId === id;
        });
      });
    case SET_SH:
      return produce(state, (draftState) => {
        let mmsiStart = moment(action.data.mmsiStart, 'YYYYMMDDHHmmss');
        mmsiStart = mmsiStart.isValid() ? mmsiStart : null;

        let shObject = {
          basic: {
            shipInfoId: action.data.shipInfoId,
            name: action.data.name,
            kind_1: action.data.kind_1,
            kind_2: action.data.kind_2,
            code: action.data.code,
            manageCode: action.data.manageCode,
            isAIS: action.data.isAIS,
            typeAIS: action.data.typeAIS,
            fairWay_1: action.data.fairWay_1,
            fairWay_2: action.data.fairWay_2,
          },
          particular: {
            length: action.data.length,
            width: action.data.width,
            depth: action.data.depth,
            weight: action.data.weight,
            speedAverage: action.data.speedAverage,
            speedMaximum: action.data.speedMaximum,
            mmsi: action.data.mmsi,
            mmsiStart,
          },
        };

        draftState.particular.sh = shObject;

        //도선 설정
        if (action.data.kind_2 === '도선') {
          draftState.isFerry = true;
        } else {
          draftState.isFerry = false;
        }
      });
    case SET_EN: {
      return produce(state, (draftState) => {
        const { data } = action;
        const { shipEngineId } = data;

        if (shipEngineId === 0) {
          draftState.particular.en = initialState.particular.en;

          // NOTE 도선일 때, 키 매핑
          if (state.selectParticular.typeAIS === 'pilot') {
            const { voyageMainEngineFuel, voyageSubEngineFuel } = data;
            draftState.particular.en = {
              ...initialState.particular.en,
              voyageMainEngineFuel,
              voyageSubEngineFuel,
            };
          }
        } else {
          draftState.particular.en = action.data;
        }
      });
    }
    case SET_TA:
      return produce(state, (draftState) => {
        // 널 체크해서 initalState 삽입
        if (getObjectSize(action.data) === 0) {
          // draftState.particular.ta;
        } else {
          draftState.particular.ta = { ...action.data, ferry: {} };
          //
        }
      });
    case SET_TA_FERRY:
      return produce(state, (draftState) => {
        if (action.data.ferry.ferryShipId === 0) {
          draftState.particular.ta.ferry = {
            ...initialState.particular.ta.ferry,
          };
        } else {
          draftState.particular.ta = action.data;
        }
      });
    case SET_TA_FIELD_CHANGE:
      const { data } = action;

      return produce(state, (draftState) => {
        draftState.particular.ta = data;
      });
    case SET_TA_INIT:
      const { vesselParticular, engineParticular } = action;

      return produce(state, (draftState) => {
        draftState.particular.ta.company = {
          ...draftState.particular.ta.company,
          ...action.company,
        };
        draftState.particular.ta.ship = {
          ...draftState.particular.ta.ship,
          ...vesselParticular,
        };
        draftState.particular.ta.mainEngine = {
          ...engineParticular.main,
          ...draftState.particular.ta.mainEngine,
        };
        draftState.particular.ta.subEngine = {
          ...engineParticular.sub,
          ...draftState.particular.ta.subEngine,
        };
      });
    case SET_TA_COMPANY_INIT:
      const company = action.data;
      return produce(state, (draftState) => {
        draftState.particular.ta.company = {
          ...draftState.particular.ta.company,
          ...company,
        };
      });
    case SET_GR:
      return produce(state, (draftState) => {
        const { dataRate } = action.data;
        draftState.particular.gr.dataRate = dataRate;
      });
    case SET_ORIGIN_GR:
      return produce(state, (draftState) => {
        const { dataRate } = action.data;

        draftState.particular.gr = action.data;
        draftState.particular.gr.originRate = dataRate;
      });
    case SET_FERRY:
      return produce(state, (draftState) => {
        const { data } = action;
        draftState.isFerry = data;
      });
    case SET_PARTICULARS:
      return produce(state, (draftState) => {
        const { particulars } = action;

        draftState.particulars = particulars;
      });
    case SET_PARTICULAR:
      const particularId = action.id;

      setCookie('vesselId', particularId);

      return produce(state, (draftState) => {
        draftState.particular = { ...initialState.particular };
        draftState.selectParticular = draftState.particulars.find(
          (v) => v.shipId === particularId
        );
      });
    case INIT_PARTICULAR:
      return produce(state, (draftState) => {
        draftState.particular = initialState.particular;
      });
    case SET_FILES:
      return produce(state, (draftState) => {
        draftState.files = action.files;
      });
    case UPLOAD_FILE:
      return produce(state, (draftState) => {
        const data = action.data;
        const { file, files } = data;
        const { status } = file;

        draftState.uploadingFile = { ...file };
      });
    default:
      return state;
  }
};

export default reducer;
