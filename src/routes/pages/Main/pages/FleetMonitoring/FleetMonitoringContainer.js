import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actionCreator from 'redux/reducer/actionCreator';

// API
import { FleetMonitoringAPI } from 'api';

import FleetMonitoringPresenter from './FleetMonitoringPresenter';

// ECA geojson
import Harborgeo from './geojson/harborGeo';
import HarborgeoLine from './geojson/harborGeoLine';
// ECA geojson
import ECAgeo from './geojson/ECAgeo';

const { fleetActions } = actionCreator;

const FleetMonitoringContainer = () => {
  // 선박 수
  const [shipCount, setShipCount] = useState({
    totalShip : 0,
    suspectTotalShip : 0,
    totalFerryShip : 0,
    suspectFerryShip : 0,
    totalCargoShip : 0,
    suspectCargoShip : 0,
    totalOtherShip : 0,
    suspectOtherShip : 0
  });

  // 선택한 항적 날짜 범위
  const [selectDate, getSelectDate] = useState([]);  
  // 선택한 선박의 항적 데이터
  const [shipRoute, setShipRoute] = useState([]);
  // 항적 데이터 로딩 상태
  const [routeLoading, setRouteLoading] = useState(true);
  
  /* REDUX */
  // 헤더에서 선택한 선박
  const selectShip = useSelector((state) => state.fleet.selectShip);  
  
  const dispatch = useDispatch();
  
  /* FUNCTIONS */
  // 모든 선박 리스트
  const getShipList = async () => {
    let response = await FleetMonitoringAPI._getShipList();
    
    return response;
  };
  // 선택한 선박의 날짜 범위 내 항적
  const getShipRoute = async (mmsi, date) => {
    let response = await FleetMonitoringAPI._getShipRoute(mmsi, date);
    
    return response;
  };
  
  /* HOOK */
  // 모든 선박 리스트
  useEffect(async () => {
    let response = await getShipList();
    const { rows } = response;
    
    if (rows) {
      const updateList = rows.ship.map((ship) => {
        const dateArr = ship.date.split('T');
        const recDate = dateArr[0] + ' ' + dateArr[1].substr(0, 5);
        
        const _ship = {
          ...ship,
          recDate
        }
        return _ship;
      });
  
      dispatch(fleetActions.setList(updateList));
      setShipCount(rows.shipInfo);
    }
  }, []);
  
  // 선택한 선박의 날짜 범위 내 항적
  useEffect(async () => {
    if (!selectDate.length || selectDate === undefined) {
      return false;
    } else {
      let response = await getShipRoute(selectShip.mmsi, selectDate);
      const { rows } = response;
      
      setShipRoute(rows);
      setRouteLoading(false);
    }
  }, [selectDate]);
  
  return (
    <FleetMonitoringPresenter
      onShipCount={shipCount}
      onSelectDate={getSelectDate}
      onShipRoute={shipRoute}
      onRouteLoading={routeLoading}
      
      Harborgeo={Harborgeo}
      HarborgeoLine={HarborgeoLine}
      ECAgeo={ECAgeo}
    />
  );
};

export default FleetMonitoringContainer;