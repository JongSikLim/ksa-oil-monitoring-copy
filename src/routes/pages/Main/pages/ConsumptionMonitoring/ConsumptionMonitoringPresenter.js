import { useCallback, useEffect, useMemo, useState } from 'react';

import { API_SERVER_URL } from 'utils';
import { downloadFromUrl, parseCommaInputNumber } from 'utils/esManager';
import ConsumptionManger from 'utils/consumptionManage';
import MessageAlert from 'utils/MessageAlert';

import { useSelector } from 'react-redux';
import consumptionApi from 'api/consumptionApi';
import URL from 'api/apiContstant';

import moment from 'moment';
import { Popover, message } from 'antd';
import ConsumptionManageTable from './components/ConsumptionManageTable';
import DateRangePicker from './components/DateRangePicker';
import { FileDownloadModal, ScatterChart } from 'components/dataDisplay';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import './ConsumptionMonitoring.css';
import { checkAvailableUIComponent } from 'utils/authorizationManager';

const {
  DOWNLOAD_CONSUMPTION_INFO_REPORT_EXCEL,
  DOWNLOAD_CONSUMPTION_INFO_REPORT_PDF,
} = URL;
const consumptionManager = new ConsumptionManger();
const { initCalcRows } = consumptionManager;

/**
 * @title json을 파라미터로 변환
 * @description json 데이터를 받아서, 패스 파라미터로 변환
 * @param {object} params
 */
const jsonToQueryParameter = (params) => {
  let queryPrameterUrlString = ``;

  if (params) {
    const keys = Object.keys(params);
    if (keys.length > 0) {
      for (let ii in keys) {
        queryPrameterUrlString += `&${keys[ii]}=${params[keys[ii]]}`;
      }
      return `?${queryPrameterUrlString.slice(1)}`;
    }
  } else {
    return '';
  }
};

/**
 * 선박연료유관리 프레젠터
 * --
 * Path: /consumptionMonitoring
 */
const ConsumptionMonitoringPresenter = ({
  requestYear,
  setRequestYear,
  shipId,
  getVesselConsumptionInfo,
}) => {
  /* Redux State */
  const selectParticular = useSelector(
    (state) => state.vessel.selectParticular
  );
  const consumptions = useSelector((state) => state.consumption.consumptions);
  const { level } = useSelector((state) => state.session.user);

  /* State */
  const [newConsumptions, setNewCosumptions] = useState([]);
  const [dateRange, setDateRange] = useState([undefined, undefined, 0]); // from, to, nowActive
  const [changeRows, setChangeRows] = useState(new Set());
  const [fileDownloadModalVisible, setFileDownloadModalVisible] =
    useState(false);
  const [fileDownloadPopoverVisible, setFileDownloadPopoverVisible] =
    useState(false);

  const { name, typeAIS } = selectParticular; // 도선여부와 AIS 설치여부 추출
  const nowActiveDate = dateRange[dateRange[2]];

  /**
   * @description 차트용 y 값 데이터 생성
   */

  const scatterChartYCols = useMemo(() => {
    return consumptions.map((row) => {
      const { consumptionRate } = row;
      return consumptionRate;
    });
  }, [newConsumptions]);

  /* Variables */
  const downloadExcelUrl =
    `${API_SERVER_URL}${DOWNLOAD_CONSUMPTION_INFO_REPORT_EXCEL}`.replace(
      ':shipId',
      shipId
    );
  const downloadPdfUrl =
    `${API_SERVER_URL}${DOWNLOAD_CONSUMPTION_INFO_REPORT_PDF}`.replace(
      ':shipId',
      shipId
    );

  /* Functions */

  /**
   * @title 월별레포트 팝업창 포커스 타겟 변경 제어 콜백 훅
   * @description 레포트 다운로드 내 기간 박스 포커싱 타겟 변경
   */
  const handleFocusDateBox = useCallback(
    (idx) => {
      let newDataRange = Array.from(dateRange);

      newDataRange[2] = idx;
      setDateRange(newDataRange);
    },
    [dateRange]
  );

  /**
   * @title 날짜 포멧 변환
   * @description 날짜를 API 요청용 포멧으로 변경한다. f => YYYYMMDDHHmmss
   * @param start 변환할 시작 날짜 f => YYYY-MM
   * @param end 변환할 끝 날짜 f => YYYY-MM
   */
  const parsingRequestDateForm = (start, end) => {
    const parsedStart = moment(start, 'YYYY-MM').format('YYYYMMDDHHmmss');
    const parsedEnd = moment(end, 'YYYY-MM').format('YYYYMMDDHHmmss');
    return [parsedStart, parsedEnd];
  };

  /**
   * @title 요청 날짜 타당성 검사
   * @description 월별 레포트의 날짜에 대한 타당성 검사
   */
  const validRequestDate = () => {
    const start = moment(dateRange[0], 'YYYY-MM');
    const end = moment(dateRange[1], 'YYYY-MM');

    return start.isBefore(end) && !start.isSame(end);
  };

  /* Hooks */
  useEffect(() => {
    let tempConsumptions = initCalcRows(consumptions);

    setNewCosumptions(tempConsumptions);
  }, [consumptions]);

  useEffect(() => {
    const clickHandler = (e) => {
      const modalnPopoverCatcher = e.path.some((el) => {
        const { className = '' } = el;
        try {
          return (
            className.includes('file-format-select-modal') ||
            className.includes('report-date-picker-popover') ||
            className.includes('report-date-picker-contaier')
          );
        } catch (error) {
          return false;
        }
      });

      if (modalnPopoverCatcher) {
        return;
      }

      setFileDownloadModalVisible(false);
      setFileDownloadPopoverVisible(false);
    };
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, []);

  /* RENDER */
  return (
    <div className="cm-container">
      <div className="cm-flex-box">
        <div className="header-interface-area">
          <div className="left-box">
            <div className="title">{name}</div>
          </div>
          <div className="right-box">
            <Popover
              id="reportDatePickerPopover"
              className="report-date-picker-popover"
              placement="bottom"
              trigger={'click'}
              visible={fileDownloadPopoverVisible}
              content={
                <div className="report-date-picker-contaier">
                  <div className="report-date-picker-flex-box">
                    <div className="header-box">
                      <span className="header-title">월별 레포트</span>
                    </div>
                    <div className="date-range-box">
                      <input
                        type="text"
                        className={`from-date-box date-box ${
                          dateRange[2] === 0 && 'active'
                        }`}
                        value={dateRange[0]}
                        onClick={() => {
                          handleFocusDateBox(0);
                        }}
                      />
                      <span className="hyphen">-</span>
                      <input
                        type="text"
                        className={`from-date-box date-box ${
                          dateRange[2] === 1 && 'active'
                        }`}
                        value={dateRange[1]}
                        onClick={() => {
                          handleFocusDateBox(1);
                        }}
                      />
                    </div>
                    <div className="calendar-box">
                      <DateRangePicker
                        date={nowActiveDate}
                        onChangeDate={(date) => {
                          let newDateRange = Array.from(dateRange);
                          newDateRange[dateRange[2]] = date;

                          setDateRange(newDateRange);
                        }}
                      />
                    </div>
                    <div className="footer-box">
                      <button
                        className="report-download-btn"
                        onClick={() => {
                          if (validRequestDate()) {
                            setFileDownloadModalVisible(true);
                            setFileDownloadPopoverVisible(false);
                          } else {
                            MessageAlert.error('레포트 다운로드 양식 오류');
                          }
                        }}
                      >
                        다운로드
                      </button>
                    </div>
                  </div>
                </div>
              }
            >
              <button
                className="default-btn btn"
                onClick={() => {
                  setFileDownloadPopoverVisible(true);
                }}
              >
                레포트 다운로드
              </button>
            </Popover>
            {checkAvailableUIComponent(level, 1, [
              <button
                className="primary-btn btn"
                onClick={() => {
                  // 로컬에서 새로 추가된 행은 POST, 기존에 있던 행은 PUT
                  let promises = [];
                  changeRows.forEach((rowIndex) => {
                    let rowConsumption = { ...newConsumptions[rowIndex] };
                    const { id } = rowConsumption;
                    let newPromise = [];

                    rowConsumption.kind = typeAIS;
                    rowConsumption.reportMonth = moment(
                      rowConsumption.reportMonth
                    ).format('YYYY-MM');

                    delete rowConsumption.files;
                    delete rowConsumption.rob;
                    delete rowConsumption.totalSupply;

                    if (rowConsumption.hasOwnProperty('id')) {
                      newPromise = consumptionApi.updateVesselConsumptionInfo(
                        shipId,
                        id,
                        rowConsumption
                      );
                    } else {
                      newPromise = consumptionApi.insertVesselConsumptionInfo(
                        shipId,
                        rowConsumption
                      );
                    }

                    promises.push(newPromise);
                  });

                  Promise.all(promises)
                    .then((res) => {
                      console.log('res: ', res);
                      res.forEach((r) => {
                        const { code = 200 } = r;

                        if (code !== 200) {
                          throw new Error('저장 실패');
                        }
                      });

                      message.success('저장 성공!');
                      getVesselConsumptionInfo(requestYear);
                      setChangeRows(new Set());
                    })
                    .catch((err) => {
                      message.error('데이터 저장에 실패했습니다.');
                      getVesselConsumptionInfo(requestYear);
                      setChangeRows(new Set());
                    });
                }}
              >
                저장
              </button>,
            ])}
          </div>
        </div>
        <div className="chart-area">
          <div className="year-selector">
            <div
              className="left-arrow-box arrow-box"
              onClick={() => {
                setRequestYear(requestYear - 1);
                setChangeRows(new Set());
              }}
            >
              <LeftOutlined />
            </div>
            <div className="text-box">{requestYear}</div>
            <div
              className="right-arrow-box arrow-box"
              onClick={() => {
                setRequestYear(requestYear + 1);
                setChangeRows(new Set());
              }}
            >
              <RightOutlined />
            </div>
          </div>
          <ScatterChart
            id="monthlyConsumptionChart"
            // x={chartXdatas}
            y={scatterChartYCols}
            adequateValue={120}
          />
          <div className="caption-box">월별 소모율 그래프</div>
        </div>
        <div className="table-area">
          <ConsumptionManageTable
            changeRows={changeRows}
            setChangeRows={setChangeRows}
            requestYear={requestYear}
            typeAIS={typeAIS}
            shipId={shipId}
            newConsumptions={newConsumptions}
            setNewCosumptions={setNewCosumptions}
            getNewConsumptions={getVesselConsumptionInfo}
          />
        </div>
      </div>
      <FileDownloadModal
        visible={fileDownloadModalVisible}
        setVisible={setFileDownloadModalVisible}
        handleClickExcel={() => {
          const [start, end] = parsingRequestDateForm(
            dateRange[0],
            dateRange[1]
          );
          const url = `${downloadExcelUrl}${jsonToQueryParameter({
            start,
            end,
          })}`;
          downloadFromUrl(url);
          setFileDownloadModalVisible(false);
        }}
        handleClickPdf={() => {
          const [start, end] = parsingRequestDateForm(
            dateRange[0],
            dateRange[1]
          );
          const url = `${downloadPdfUrl}${jsonToQueryParameter({
            start,
            end,
          })}`;

          downloadFromUrl(url);
          setFileDownloadModalVisible(false);
        }}
      />
    </div>
  );
};

export default ConsumptionMonitoringPresenter;
