import { Input, InputNumber } from 'antd';
import particularApi from 'api/particularApi';
import produce from 'immer';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionCreator from 'redux/reducer/actionCreator';
import { debounce } from 'throttle-debounce';
import { calcTaFerryInfo } from 'utils/AutoCalculate';

const { vesselActions } = actionCreator;
const { TextArea } = Input;

const ConsumptionStandard = () => {
  const dispatch = useDispatch();
  const info = useSelector(
    (state) => state.vessel.particular.ta,
    (left, right) => {
      return true;
    }
  );
  const selectParticular = useSelector(
    (state) => state.vessel.selectParticular
  );

  const isFerry = selectParticular['kind_2'] === '도선' ? true : false;
  const { shipId } = selectParticular;
  const { company, ship, mainEngine, subEngine, ferry } = info;

  const setInfo = (newData) => {
    dispatch(vesselActions.setTaFieldChange(newData));
  };

  /**
   * @description 실수의 소수점을 절삭하여 반환한다.
   * @param num 소숫점 절삭할 숫자
   * @param precision 절삭할 소숫점 자릿수
   * @return Success => 소수점 처리한 실수
   * @return Failure => num이 NaN인경우 0 반환
   */
  const adjustPrecision = useCallback((num, precision) => {
    if (Number.isNaN(num)) return 0;
    const loopArray = Array(precision).fill(10);
    const correctionValue = loopArray.reduce((prev, curr) => {
      return prev * 10;
    });
    return Math.floor(num * correctionValue) / correctionValue;
  }, []);

  /**
   * @description 입력 처리를 받아서, 소숫점 절삭해서 반환
   * @param value 입력받은 값
   * @param precision 절삭할 소수점 자릿수
   * @return Success => 소수점 처리한 실수
   */
  const parseInputNumberPrecision = (value, precision = 1) => {
    if (value.indexOf('.') === value.length - 1) {
      return value;
    } else if (value.charAt(value.length - 1) === '0') {
      return value;
    } else {
      return adjustPrecision(parseFloat(value), precision);
    }
  };

  const fuelConsumptionInputConfig = {
    bordered: false,
    parser: (value) => {
      return parseInputNumberPrecision(value, 4);
    },
  };

  // 선박 변경시 TA 정보 API를 통해서 받아온다.
  useEffect(() => {
    if (isFerry) {
      particularApi.getTAFerryInfo(shipId).then((res) => {
        const calcedData = calcTaFerryInfo(res.rows);
        dispatch(vesselActions.setTAFerry(calcedData));
      });
    } else {
      particularApi.getTAInfo(shipId).then((res) => {
        dispatch(vesselActions.setTa(res.rows));
      });
    }
  }, [selectParticular]);

  return (
    <div className="cs-container">
      <div className="cs-flex-box">
        <div className="title-area">
          선박연료유소요량기준표 <br />
          <div className="sub-title">
            {isFerry ? '(도선용)' : '(연안여객선 및 연안화물선용)'}
          </div>
        </div>
        {isFerry ? (
          //도선
          <div className="document-area">
            <div className="document-box company-box">
              <div className="box-title">1. 경영자</div>
              <div className="document">
                <div className="document-table">
                  <table>
                    <tr>
                      <th className="header" style={{ width: '116px' }}>
                        주소
                      </th>
                      <td
                        colSpan={3}
                        className="data"
                        style={{ width: '626px' }}
                      >
                        {company.address}
                      </td>
                    </tr>
                    <tr>
                      <th className="header">성명</th>
                      <td className="data" style={{ width: '253px' }}>
                        {company.chief}
                      </td>
                      <th className="header" style={{ width: '166px' }}>
                        선사명
                      </th>
                      <td className="data" style={{ width: '203px' }}>
                        {company.name}
                      </td>
                    </tr>
                    <tr>
                      <th className="header">사업자등록번호</th>
                      <td className="data">{company.companyNumber}</td>
                      <th className="header">법인등록번호(생년월일)</th>
                      <td className="data">{company.corporateNumber}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className="document-box">
              <div className="box-title">2. 선박제원</div>
              <div className="document">
                <div className="document-table">
                  <table>
                    <tr>
                      <th className="header" rowSpan={2}>
                        선명
                      </th>
                      <th className="header" rowSpan={2}>
                        총톤수
                      </th>
                      <th className="header" rowSpan={2}>
                        운항구간
                      </th>
                      <th className="header" rowSpan={2}>
                        평균
                        <br />
                        운항거리
                        <br />
                        (km)
                      </th>
                      <th
                        className="header"
                        rowSpan={2}
                        style={{ position: 'relative', padding: 'none' }}
                      >
                        <div className="badge badge-a">A</div>
                        평균
                        <br />
                        운항횟수
                        <br />
                        (월/왕복)
                      </th>
                      <th className="header" rowSpan={2}>
                        평균
                        <br />
                        항해속력
                        <br />
                        (노트)
                      </th>
                      <th
                        className="header"
                        colSpan={3}
                        style={{ height: '23px' }}
                      >
                        항차당 평균 항해시간
                      </th>
                      <th
                        className="header"
                        colSpan={3}
                        style={{ height: '23px' }}
                      >
                        기관
                      </th>
                    </tr>
                    <tr>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        항해시간
                      </th>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        대기시간
                      </th>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        계
                      </th>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        종류
                      </th>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        주기마력
                        <br />
                        (bhp)
                      </th>
                      <th
                        className="sub-header"
                        style={{ width: '57px', height: '36px' }}
                      >
                        보기마력
                        <br />
                        (bhp)
                      </th>
                    </tr>
                    <tr style={{ height: '61px' }}>
                      <td className="data" style={{ width: '85px' }}>
                        {ship.name}
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {ship.weight}
                      </td>
                      <td className="data" style={{ width: '67px' }}>
                        {' '}
                        {`${ship.fairWay_1 ? ship.fairWay_1 : ''}-${
                          ship.fairWay_2 ? ship.fairWay_2 : ''
                        }`}
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 평균운항거리 */}
                        <InputNumber
                          bordered={false}
                          value={ferry.flightDistance}
                          onChange={async (e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.flightDistance = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 평균 운항횟수 */}
                        <InputNumber
                          bordered={false}
                          min={1}
                          max={999}
                          value={ferry.flightCount}
                          onChange={(e) => {
                            const value = e;

                            //NOTE 산출 내역 데이터들 갱신 필요
                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.flightCount = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {ferry.flightNote}
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 항해시간 */}
                        <InputNumber
                          bordered={false}
                          min={0}
                          max={100}
                          value={ferry.sailingTime}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.sailingTime = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 대기시간 */}
                        <InputNumber
                          bordered={false}
                          min={0}
                          max={100}
                          value={ferry.waitingTime}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.waitingTime = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 계 */}
                        {ferry.totalTime}
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 엔진 종류 */}
                        <TextArea
                          rows={2}
                          maxLength={8}
                          bordered={false}
                          value={ferry.engineName}
                          onChange={(e) => {
                            const value = e.target.value;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.engineName = value;
                            });

                            //setInfo(newInfo);
                            setInfo(calcTaFerryInfo(newInfo));
                            // setInfo(AutoCalculate(newInfo));
                          }}
                          style={{
                            padding: 0,
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 주기마력 bhp */}
                        <InputNumber
                          bordered={false}
                          min={0}
                          max={99999}
                          value={ferry.mainEnginePower}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.mainEnginePower = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '57px' }}>
                        {/* 보기마력 bhp */}
                        <InputNumber
                          bordered={false}
                          min={0}
                          max={99999}
                          value={ferry.subEnginePower}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.subEnginePower = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className="document-box">
              <div className="box-title">3. 유류소요량</div>
              <div className="document">
                <div className="document-table">
                  <table>
                    <tr>
                      <th className="header" colSpan={2}>
                        구분
                      </th>
                      <th className="header">
                        시간당 마력당
                        <br />
                        소요량(ℓ)
                      </th>
                      <th className="header" style={{ position: 'relative' }}>
                        <div className="badge badge-a">B</div>
                        항차당
                        <br />
                        소요량 (ℓ)
                      </th>
                      <th className="header">유종</th>
                      <th className="header">산출내역</th>
                    </tr>
                    <tr>
                      <th
                        className="header"
                        rowSpan={3}
                        style={{ width: '66px' }}
                      >
                        주기
                      </th>
                      <th className="sub-header" style={{ width: '100px' }}>
                        항해중
                      </th>
                      <td className="data" style={{ width: '120px' }}>
                        <InputNumber
                          {...fuelConsumptionInputConfig}
                          value={ferry.mainSailingSpend}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.mainSailingSpend = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      <td className="data" style={{ width: '120px' }}>
                        {/* 항해중 항차당 소요량 = 항해시간 * 주기마력 */}
                        {ferry.mainSailingVoyageSpend}
                      </td>
                      {/* 항해중 유종 */}
                      <td className="data" style={{ width: '120px' }}>
                        <Input
                          bordered={false}
                          value={ferry.mainSailingOil}
                          onChange={(e) => {
                            const value = e.target.value;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.mainSailingOil = value;
                            });

                            //setInfo(newInfo);
                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      {/* 항해중 산출내역 */}
                      <td className="data">
                        <div className="badge-box">
                          <div className="badge-item">A</div>X
                          <div className="badge-item">B</div>
                        </div>
                        {/* {ferry.sailingCalculation} */}
                      </td>
                    </tr>
                    <tr>
                      <th className="sub-header">대기중</th>
                      <td className="data">
                        <InputNumber
                          {...fuelConsumptionInputConfig}
                          value={ferry.mainWaitingSpend}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.mainWaitingSpend = value;
                            });

                            //setInfo(newInfo);
                            setInfo(calcTaFerryInfo(newInfo));
                            //setInfo(AutoCalculate(newInfo));
                          }}
                        />
                      </td>
                      <td className="data">{ferry.mainWaitingVoyageSpend}</td>
                      <td className="data">
                        <Input
                          bordered={false}
                          value={ferry.mainWaitingOil}
                          onChange={(e) => {
                            const value = e.target.value;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.mainWaitingOil = value;
                            });

                            //setInfo(newInfo);
                            setInfo(calcTaFerryInfo(newInfo));
                            // setInfo(AutoCalculate(newInfo));
                          }}
                        />
                      </td>
                      {/* 대기중 산출내역 */}
                      <td className="data">
                        <div className="badge-box">
                          <div className="badge-item">A</div>X
                          <div className="badge-item">B</div>
                        </div>
                        {/* {ferry.waitingCalculation} */}
                      </td>
                    </tr>
                    <tr>
                      <th className="sub-header">소계</th>
                      <td className="data">{ferry.totalMainSpend}</td>
                      <td className="data">{ferry.totalMainVoyageSpend}</td>
                      <td className="data"></td>
                      <td className="data"></td>
                    </tr>
                    <tr>
                      <th className="header" colSpan={2}>
                        보기
                      </th>
                      {/* 대기중 시간당 마력 소요량 */}
                      <td className="data">
                        <InputNumber
                          {...fuelConsumptionInputConfig}
                          value={ferry.subSpend}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.subSpend = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      {/* 대기중 항차당 소요량 */}
                      <td className="data">
                        <InputNumber
                          {...fuelConsumptionInputConfig}
                          value={ferry.subVoyageSpend}
                          onChange={(e) => {
                            const value = e;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.subVoyageSpend = value;
                            });

                            setInfo(calcTaFerryInfo(newInfo));
                          }}
                        />
                      </td>
                      {/* 대기중 유종 */}
                      <td className="data">
                        <Input
                          bordered={false}
                          value={ferry.subOil}
                          onChange={(e) => {
                            const value = e.target.value;

                            const newInfo = produce(info, (draftInfo) => {
                              draftInfo.ferry.subOil = value;
                            });

                            //setInfo(newInfo);
                            setInfo(calcTaFerryInfo(newInfo));
                            // setInfo(AutoCalculate(newInfo));
                          }}
                        />
                      </td>
                      {/* 보기 산출내역 */}
                      <td className="data">
                        <div className="badge-box">
                          <div className="badge-item">A</div>X
                          <div className="badge-item">B</div>
                        </div>
                        {/* {ferry.subCalculation} */}
                      </td>
                    </tr>
                    <tr>
                      <th className="header" colSpan={2}>
                        합계
                      </th>
                      <td className="data">{ferry.totalSpend}</td>
                      <td className="data">{ferry.totalVoyageSpend}</td>
                      <td className="data"></td>
                      <td className="data"></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className="warning-box document-box">
              위와 같이 선박연료유 소요량을 제출하오니 확인하여 주시기 바라며,
              「조세특례제한법」 에 따라 유류세가 면제되는 석유류를 공급받아
              사용함에 있어 부정한 행위를 하지 않고 조합이 시행하는 연료유
              소요량 확인업무에 적극 협조하며, 이를 준수하지 않을 경우 석유류
              공급 제한(중지)에 이의를 제기하지 않을 것을 확약함.
            </div>
            <div className="sign-box document-box">
              <div className="sign-date">
                <span className="date-field">년</span>
                <span className="date-field">월</span>
                <span className="date-field">일</span>
              </div>

              <div className="sign">
                <span className="sign-owner">확 인 자 ( 기 관 장 ) :</span>
                <span className="sign-guide">(인)</span>
              </div>
              <div className="sign">
                <span className="sign-owner">회사대표 ( 대 표 자 ) :</span>
                <span className="sign-guide">(인)</span>
              </div>
            </div>
          </div>
        ) : (
          // AIS 설치, 미설치
          <div className="document-area">
            <div className="company-box document-box">
              <div className="box-title">1. 사업자</div>

              <div className="document">
                <table className="document-table">
                  <tr>
                    <th className="header" style={{ width: '116px' }}>
                      선사명
                    </th>
                    <td className="data" style={{ width: '253px' }}>
                      {company.name}
                    </td>
                    <th className="header" style={{ width: '166px' }}>
                      대표자
                    </th>
                    <td className="data" style={{ width: '203px' }}>
                      {company.chief}
                    </td>
                  </tr>
                  <tr>
                    <th className="header">사업자등록번호</th>
                    <td className="data">{company.companyNumber}</td>
                    <th className="header">법인등록번호(생년월일)</th>
                    <td className="data">{company.corporateNumber}</td>
                  </tr>
                  <tr>
                    <th className="header">주소</th>
                    <td className="data" colSpan={3}>
                      {company.address}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="particular-box document-box">
              <div className="box-title">2. 선박 및 엔진 제원</div>
              <div className="document">
                <table className="document-table particular-table">
                  <tr>
                    <th className="header">선명</th>
                    <th className="header">선종</th>
                    <th className="header">선박번호</th>
                    <th className="header">MMSI</th>
                    <th className="header">운항구간</th>
                    <th className="header">길이(LOA)</th>
                    <th className="header">너비(WIDTH)</th>
                    <th className="header">총톤수(GT)</th>
                  </tr>
                  <tr>
                    <td className="data">{ship.name}</td>
                    <td className="data">{ship.kind_1}</td>
                    <td className="data">{ship.code}</td>
                    <td className="data">{ship.mmsi ? ship.mmsi : '-'}</td>
                    <td className="data">
                      {`${ship.fairWay_1 ? ship.fairWay_1 : ''}-${
                        ship.fairWay_2 ? ship.fairWay_2 : ''
                      }`}
                    </td>
                    <td className="data">{ship.length}</td>
                    <td className="data">{ship.width}</td>
                    <td className="data">{ship.weight}</td>
                  </tr>
                </table>

                <table
                  className="document-table "
                  style={{ marginTop: '20px' }}
                >
                  <tr className="engine-particular-header-row">
                    <th className="header" colSpan={2}>
                      항해속력(kts)
                    </th>
                    <th className="header" colSpan={3}>
                      주기관
                    </th>
                    <th className="header" colSpan={3}>
                      보조기관
                    </th>
                  </tr>
                  <tr className="engine-particular-header-row-sub">
                    <th className="sub-header">최대</th>
                    <th className="sub-header">평균</th>
                    <th className="sub-header">제조사(Maker)</th>
                    <th className="sub-header">엔진타입(Model)</th>
                    <th className="sub-header">엔진대수</th>
                    <th className="sub-header">제조사(Maker)</th>
                    <th className="sub-header">엔진타입(Model)</th>
                    <th className="sub-header">엔진대수</th>
                  </tr>
                  <tr className="engine-particular-value-row">
                    <td className="data">{ship.speedMaximum}</td>
                    <td className="data">{ship.speedAverage}</td>
                    <td className="data">{mainEngine.manufacturer}</td>
                    <td className="data">{mainEngine.model}</td>
                    <td className="data">{mainEngine.amount}</td>
                    <td className="data">{subEngine.manufacturer}</td>
                    <td className="data">{subEngine.model}</td>
                    <td className="data">{subEngine.amount}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="consumption-box document-box">
              <div className="box-title">3. 기관별 연료유소요량</div>
              <div className="document engine-table-box">
                <table className="document-table main-engine-table">
                  <tr className="fuel-consumption-header-row">
                    <th className="header">구분</th>
                    <th className="header">부하 (%)</th>
                    <th className="header">선속 (노트)</th>
                    <th className="header">제동마력 (kw)</th>
                    <th className="header">
                      시간당
                      <br />
                      연료소모량 (ℓ/h)
                    </th>
                  </tr>

                  {mainEngine.consumption.map((c, i) => {
                    if (i === 0) {
                      return (
                        <tr>
                          <th className="header" rowSpan={5}>
                            주기관
                          </th>
                          <td className="data">{c.load}</td>
                          <td className="data">{c.speed}</td>
                          <td className="data">{c.kw}</td>
                          <td className="data">{c.fuelConsumption}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr>
                          <td className="data">{c.load}</td>
                          <td className="data">{c.speed}</td>
                          <td className="data">{c.kw}</td>
                          <td className="data">{c.fuelConsumption}</td>
                        </tr>
                      );
                    }
                  })}
                </table>
                <table className="document-table sub-engine-table">
                  <tr className="fuel-consumption-header-row">
                    <th className="header">구분</th>
                    <th className="header">평균 부하 (%)</th>
                    <th className="header">
                      평균 시간당
                      <br />
                      연료소모량 (ℓ/h)
                    </th>
                  </tr>
                  <tr>
                    <th className="header fill-height">보조기관</th>
                    <td className="data fill-height">
                      {subEngine.consumption &&
                      subEngine.consumption.subEngineLoad
                        ? subEngine.consumption.subEngineLoad
                        : 0}
                    </td>
                    <td className="data fill-height">
                      {subEngine.consumption &&
                      subEngine.consumption.subEngineFuel
                        ? subEngine.consumption.subEngineFuel
                        : 0}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="warning-box document-box">
              위와 같이 선박연료유 소요량을 제출하오니 확인하여 주시기 바라며,
              「조세특례제한법」 에 따라 유류세가 면제{' '}
              <span style={{ color: 'red' }}>(감면)</span> 되는 석유류를
              공급받아 사용함에 있어 부정한 행위를 하지 않고 조합이 시행하는
              연료유 소요량 확인업무에 적극 협조하며, 이를 준수하지 않을 경우
              석유류 공급 제한(중지)에 이의를 제기하지 않을 것을 확약함.
            </div>
            <div className="sign-box document-box">
              <div className="sign-date">
                <span className="date-field">년</span>
                <span className="date-field">월</span>
                <span className="date-field">일</span>
              </div>

              <div className="sign">
                <span className="sign-owner">확 인 자 ( 기 관 장 ) :</span>
                <span className="sign-guide">(인)</span>
              </div>
              <div className="sign">
                <span className="sign-owner">회사대표 ( 대 표 자 ) :</span>
                <span className="sign-guide">(인)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumptionStandard;
