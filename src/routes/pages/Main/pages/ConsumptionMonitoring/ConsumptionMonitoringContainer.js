/**
 *
 */

import { ConsumptionApi, ParticularAPI } from 'api';
import React, { useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { vesselActions } from 'redux/reducer/vessel';
import ConsumptionMonitoringPresenter from './ConsumptionMonitoringPresenter';
import actionCreator from 'redux/reducer/actionCreator';
import moment from 'moment';
import { getObjectSize } from 'utils/esManager';
import { v4 } from 'uuid';
import ConsumptionManger from 'utils/consumptionManage';

const { consumptionActions } = actionCreator;

const consumptionManager = new ConsumptionManger();

/**
 * 선박 연료유관리 컨테이너
 * --
 * Path: /consumptionMonitoring
 */
const ConsumptionMonitoringContainer = () => {
  /* State */
  const dispatch = useDispatch();
  const selectParticular = useSelector(
    (state) => state.vessel.selectParticular
  );
  const { shipId } = selectParticular;
  const [requestYear, setRequestYear] = useState(moment().year());

  /* Functions */
  /**
   * @title 연료유 정보 수신
   * @description 해당년도, 변경된 선박에 해당하는 연료유관리정보를 수신후 SUMMARY 및 KEY할당하여 소요량 데이터 상태 저장
   */
  const getVesselConsumptionInfo = (requestYear) => {
    ConsumptionApi.getVesselConsumptionInfo(shipId, requestYear).then((res) => {
      const { rows } = res;
      const result = getObjectSize(rows) === 0 ? [] : rows;
      const tempConsumption = result.map((row) => {
        return {
          ...row,
          key: v4(),
        };
      });

      batch(() => {
        dispatch(
          consumptionActions.setSummary(
            consumptionManager.calcSummary(tempConsumption)
          )
        );
        dispatch(consumptionActions.setConsumptions(tempConsumption));
      });
    });
  };

  /**
   * @title 선박 혹은 확인년도 변경시 api 요청 함수
   * @description 선박 혹은 확인년도 변경시 해당하는 데이터를 요청하는 함수를 호출
   */
  useEffect(() => {
    getVesselConsumptionInfo(requestYear);
  }, [requestYear, shipId]);

  /* RENDER */
  return (
    <ConsumptionMonitoringPresenter
      requestYear={requestYear}
      setRequestYear={setRequestYear}
      shipId={shipId}
      getVesselConsumptionInfo={getVesselConsumptionInfo}
    />
  );
};

export default ConsumptionMonitoringContainer;
