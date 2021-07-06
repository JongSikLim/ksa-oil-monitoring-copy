import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actionCreator, { setFleetSelectShipAction } from 'redux/reducer/actionCreator';

// Map custom css
import './FleetMonitoring.css';

// Map Component
import Map from './components/Map';
// Side Component
import ShipCount from './components/ShipCount';
import ShipPanel from './components/ShipPanel';

const FleetMonitoringPresenter = (props) => {
    const {
        onShipCount,
        onSelectDate,
        onShipRoute,
        onRouteLoading,
        
        Harborgeo,
        HarborgeoLine,
        ECAgeo
    } = props;

    /* STATE */
    // 선택한 선박 데이터
    const [shipInfo, getShipInfo] = useState({});  
    // 항적 날짜 범위 선택
    const [selectDate, getSelectDate] = useState([]);
    // 헤더에서 선택한 리스트 타입에 따라 list filter
    const [filteredShipList, setFilteredShipList] = useState([]);
    
    /* REDUX */
    // 선박 리스트
    const shipList = useSelector((state) => state.fleet.shipList);
    // console.log('shipList useSelector', shipList);
    // 헤더에서 선택한 선박
    const selectShip = useSelector((state) => state.fleet.selectShip);
    // 헤더에서 선택한 리스트 타입
    const listType = useSelector((state) => state.fleet.listType);
    
    const dispatch = useDispatch();

    /* HOOK */    
    useEffect(() => {
        getShipInfo({});
    }, []);
    
    // 헤더에서 선택한 리스트 타입
    useEffect(() => {        
        // 선종에 따라 onShipList -> map 전달(dispatch 하게 되면 헤더 리스트도 변경됨 주의)
        if (shipList.length && (listType !== null && listType !== 'all')) {
            const filtered = shipList.filter((ship) => {
                const { kind } = ship;
                
                if (listType === 'ferry') {
                    return kind === '여객선';
                } else if (listType === 'cargo') {
                    return kind === '화물선' || kind === '예부선' || kind === '유조선';
                } else if (listType === 'etc') {
                    return kind === '기타선';
                }
            });
            
            getShipInfo({ id: 0 });
            setFilteredShipList(filtered);
        } else if (shipList.length && (listType === null || listType === 'all')) {
            setFilteredShipList(shipList);
        }
        
        return () => {
            setFilteredShipList([]);
        }
    }, [shipList, listType]);
    
    // 선택한 날짜 범위 파라미터 생성
    useEffect(() => {
        // selectDate['', '']
        // yyyy-MM-dd hh:mm -> yyyy-MM-ddThh:mm
        const resetDate = selectDate.map((date) => {
            const split = date.split(' ');
            return split[0] + 'T' + split[1] + ':00';
        });
      
        onSelectDate(resetDate);
    }, [selectDate]);
  
    // 선택한 선박 데이터
    useEffect(() => {
        if (Object.keys(shipInfo).length) {
            // 이미 선택한 선박이라면
            if (selectShip.id === shipInfo.id) {
                return;
            } else {
                setFleetSelectShipAction(dispatch, shipInfo);
            }
        } else {
            setFleetSelectShipAction(dispatch, shipInfo);
        }
    }, [shipInfo]);
  
    return (
        <div className="map-wrapper">
            <ShipCount
                shipCount={onShipCount}
            />

            {/* 선택한 선박이 있을 경우 */}
            { (selectShip && Object.keys(selectShip).length > 0 && selectShip.id !== 0) &&
                <ShipPanel
                    onSelectShip={selectShip}
                
                    onShipRoute={onShipRoute}
                    onRouteLoading={onRouteLoading}
                    onSelectDate={getSelectDate}
                />
            }

            {/* 지도 */}
            <Map
                onAllShipList={shipList}
                onFilteredShipList={filteredShipList}
                onSelectShip={selectShip}
                
                onShipInfo={getShipInfo}
                onSelectDate={selectDate}
                onShipRoute={onShipRoute}
                
                harborData={Harborgeo}
                harborDataLine={HarborgeoLine}
                ecaData={ECAgeo}
            />
        </div>
    );
};

export default FleetMonitoringPresenter;