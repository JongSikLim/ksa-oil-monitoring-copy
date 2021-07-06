import { companyActions } from './company';
import { vesselActions } from './vessel';
import { loginActions } from './session';
import { consumptionActions } from './consumption';
import { fleetActions } from './fleet';
import { batch } from 'react-redux';
import { ParticularAPI } from 'api';

/**
 * @title 최초 페이지 로드 시 선사 선택 패서드 액션
 * @description 최초 페이지 로드시 이전에 선택한 선사의 정보를 가져오기 위한 액션
 */
export const setInitCompanyFacadeAction = (dispatch, id) => {
  dispatch(companyActions.setCompany(id));
};

/**
 * @title 최초 페이지 로드 시 선박 선택 패서드 액션
 * @description 최초 페이지 로드시 이전에 선택한 선박의 정보를 가져오기 위한 액션
 */
export const setInitVesselFacadeAction = (dispatch, id) => {
  batch(() => {
    dispatch(vesselActions.setVessel(id));
    dispatch(vesselActions.setParticular(id));
  });
};

/**
 * @title 선사 선택 패서드 액션
 * @description 선사 선택시 필요한 처리들의 집합
 * @param {*} dispatch
 * @param {*} company
 */
export const selectCompanyFacadeAction = async (dispatch, company) => {
  const { companyId, ship } = company;

  try {
    const response = await ParticularAPI.getCompanyParticular(companyId);
    const { rows } = response;
    const { ship } = rows;

    dispatch(vesselActions.setParticulars(ship));
  } catch (error) {
    //FIXME 에러 알림 필요
  }

  batch(() => {
    dispatch(companyActions.setCompany(companyId, company));
    dispatch(vesselActions.setVessels(ship));

    if (ship.length) {
      dispatch(vesselActions.setVessel(ship[0].shipId));
      dispatch(vesselActions.setParticular(ship[0].shipId));
    }
  });
};

/**
 * @title 선박 선택의 패서드 액션
 * @description 선박 선택시 필요한 처리들의 집합
 * @param {*} dispatch
 * @param {*} vessel
 */
export const selectVesselParticularFacadeAction = (dispatch, vessel) => {
  batch(() => {
    // dispatch(vesselActions.initParticular());
    dispatch(vesselActions.setVessel(vessel.shipId));
    dispatch(vesselActions.setParticular(vessel.shipId));
    dispatch(vesselActions.setFiles([]));
  });
};

/**
 * @title 선박제원정보페이지에서 선박 선택의 패서드 액션
 * @param {*} dispatch
 * @param {*} particulars
 */
export const setVesselParticularInfosFacadeAction = (dispatch, particulars) => {
  batch(() => {
    //NOTE 도선 체크여부 바로 갱신하지 않으면 하위 컴포넌트에서 FERRY값이 갱신되지 않은채로 돈다.
    const isFerry = particulars[0]['kind_2'] === '도선' ? true : false;
    const company = particulars[2];
    dispatch(vesselActions.setSh(particulars[0]));
    dispatch(vesselActions.setEn(particulars[1]));
    dispatch(
      vesselActions.setTaInit(particulars[0], particulars[1], particulars[2])
    );
  });
};

export const setFleetShipListAction = (dispatch, shipList) => {
  batch(() => {
    dispatch(fleetActions.setList(shipList));
  });
};

export const setFleetSelectShipAction = (dispatch, ship) => {
  batch(() => {
    dispatch(fleetActions.setShip(ship.id));
  });
};

const combineActions = {
  companyActions,
  vesselActions,
  loginActions,
  consumptionActions,
  fleetActions,
};
export default combineActions;
