import React, { useEffect, useState } from 'react';

import produce from 'immer';
import { batch, useDispatch, useSelector } from 'react-redux';
import actionCreator from 'redux/reducer/actionCreator';

import { ParticularAPI } from 'api';

import { checkAvailable } from 'utils/authorizationManager';

import { InputNumber, Table } from 'antd';

import { LineChart } from 'components/dataDisplay';
import FERRY_NOT_SUPPORT_IMG from 'assets/svgs/img_no-data.svg';

const { vesselActions } = actionCreator;

const ConsumptionChart = () => {
  /* States */
  const dispatch = useDispatch();
  const selectParticular = useSelector(
    (state) => state.vessel.selectParticular
  );
  const dataInfo = useSelector((state) => state.vessel.particular.gr);
  const { level } = useSelector((state) => state.session.user);

  const [loadTableOriginData, setLoadTableOriginData] = useState([]);

  const { dataRate, originRate } = dataInfo;
  const { shipId } = selectParticular;
  const isFerry = selectParticular['kind_2'] === '도선' ? true : false;

  /* Hooks */
  useEffect(async () => {
    try {
      ParticularAPI.getGRInfo(shipId)
        .then((res) => {
          let { info, rows } = res;
          if (Object.keys(rows).length === 0) rows = []; // 빈값 처리 공식

          let newRows = rows.map((r, i) => {
            return { ...r, index: i + 1 };
          });

          batch(() => {
            dispatch(vesselActions.setOriginGr(info)); // redux에 저장 (상위 컴포넌트에서 필요)
            setLoadTableOriginData(newRows); // (현재 컴포넌트에서만 필요)
          });
        })
        .catch((err) => {});
    } catch (error) {}
  }, [selectParticular]);

  // 테이블에 들어가는 실제 데이터 정제 작업
  const loadTableSource = loadTableOriginData.map((row, i) => {
    let { fuelConsumptionRate, fuelConsumption } = row;

    return {
      ...row,
      key: i,
      fuelConsumptionRate: parseFloat(
        (fuelConsumptionRate *= dataRate / originRate).toFixed(2)
      ),
      fuelConsumption: parseFloat(
        (fuelConsumption *= dataRate / originRate).toFixed(2)
      ),
    };
  });

  // 차트에 표시되는 데이터 삽입
  let chartX = [],
    chartY = [],
    chartY2 = [];

  loadTableSource.forEach((row) => {
    const { load, speed, fuelConsumption } = row;

    chartX.push(load);
    chartY.push(speed);
    chartY2.push(fuelConsumption);
  });

  /* Render */
  return (
    <div className="cc-container">
      <div className="cc-flex-box">
        {isFerry ? (
          <>
            <div className="empty-box">
              <div className="image-box">
                <img src={FERRY_NOT_SUPPORT_IMG} />
              </div>
              <div className="title-box">
                <div className="header-title">
                  도선은 그래프가 존재하지 않습니다.
                </div>
                <div className="sub-title">
                  도선은 그래프가 존재하지 않습니다.
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="chart-area">
              <div className="chart-title">선속 소모량 특성곡선</div>
              <LineChart
                id={'consumptionPerSpeed'}
                x={chartX}
                y={chartY}
                y2={chartY2}
                grid={true}
              />
            </div>
            <div className="data-area">
              <Table
                bordered
                columns={[
                  {
                    title: '　',
                    dataIndex: 'index',
                  },
                  {
                    title: '부하 (%)',
                    dataIndex: 'load',
                  },
                  {
                    title: '선속 (노트)',
                    dataIndex: 'speed',
                  },
                  {
                    title: '제동 마력 (kW)',
                    dataIndex: 'kw',
                  },
                  {
                    title: (filters, sortOrder) => (
                      <div
                        className="custom-table-header"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <div className="label">연료소모율 (g/kwh)</div>
                        <div
                          className="interface"
                          style={{ marginLeft: '10px' }}
                        >
                          <InputNumber
                            id="fuelConsumptionRateInput"
                            className="fuel-consumption-rate-input"
                            size="small"
                            value={dataRate}
                            disabled={!checkAvailable(level, 7)}
                            onChange={(val) => {
                              let newDataInfo = produce(
                                dataInfo,
                                (draftInfo) => {
                                  draftInfo.dataRate = val;
                                }
                              );
                              dispatch(vesselActions.setGr(newDataInfo));
                            }}
                          />
                        </div>
                      </div>
                    ),
                    dataIndex: 'fuelConsumptionRate',
                  },
                  {
                    title: '연료소모량 (ℓ/h)',
                    dataIndex: 'fuelConsumption',
                    // render: (t, r) => {
                    //   return t.toFixed(2);
                    // },
                  },
                ]}
                dataSource={loadTableSource}
                pagination={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ConsumptionChart);
