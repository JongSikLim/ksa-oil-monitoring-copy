import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import CalcConsumptionTable from './CalcConsumptionTable/CalcConsumptionTable';
import AUTO_CALC_FIELD_LEGEND from 'assets/svgs/icon_table_legend1.svg';
import { consumption } from 'redux/reducer';
import { CalcConsumptionApi } from 'api';
import produce from 'immer';
import MessageAlert from 'utils/MessageAlert';
import { adjustPrecision, downloadFromUrl } from 'utils/esManager';
import { v1 } from 'uuid';
import { FileDownloadModal } from 'components/dataDisplay';
import { jsonToQueryParameter } from 'utils/ApiManager';
import { API_SERVER_URL } from 'utils';
import URL from 'api/apiContstant';
import { useSelector } from 'react-redux';
import { checkAvailableUIComponent } from 'utils/authorizationManager';

const {
  DOWNLOAD_CALC_CONSUMPTION_REPORT_EXCEL,
  DOWNLOAD_CALC_CONSUMPTION_REPORT_PDF,
} = URL;

/**
 * @title 시간 값 변경
 * @description 항해, 대기 시간을 ui 데이터에 맞게 필터링한다.
 * @param min
 */
const convertMinutesToTimeString = (min) => {
  return `${parseInt(min / 60)}h ${parseInt(min % 60)}m`;
};

const CalcConsumptionModal = ({ shipId, row, visible, setVisible }) => {
  /* Redux State */
  const { level } = useSelector((state) => state.session.user);

  /* state */
  const [calcState, setCalcState] = useState(false);
  const [originCalcConsumption, setOriginCalcConsumption] = useState([]);
  const [changeRow, setChangeRow] = useState(new Set());
  const [deletedRows, setDeletedRows] = useState(new Set());
  const [reportDownloadModalVisible, setReportDownloadModalVisible] =
    useState(false);

  /* Ref */
  const tableKey = useRef(v1());

  /* Hooks */
  useEffect(() => {
    getCalcConsumptionPeriod();

    return () => {
      setOriginCalcConsumption([]);
      setChangeRow(new Set());
      setDeletedRows(new Set());
    };
  }, [row.reportMonth]);

  /* Variable  */
  const downloadExcelUrl =
    `${API_SERVER_URL}${DOWNLOAD_CALC_CONSUMPTION_REPORT_EXCEL}`.replace(
      ':shipId',
      shipId
    );
  const downloadPdfUrl =
    `${API_SERVER_URL}${DOWNLOAD_CALC_CONSUMPTION_REPORT_PDF}`.replace(
      ':shipId',
      shipId
    );

  // summary 에 들어갈 데이터 값
  let summary = originCalcConsumption.reduce(
    (prev, current) => {
      return {
        originVoyageMins: prev.originVoyageMins + current.originVoyageMins,
        originWaitingMins: prev.originWaitingMins + current.originWaitingMins,
        // averageSpeed: prev.averageSpeed + current.averageSpeed,
        distance: prev.distance + current.distance,
        reportOil: prev.reportOil + current.reportOil,
        calculationOil: prev.calculationOil + current.calculationOil,
      };
    },
    {
      originVoyageMins: 0,
      originWaitingMins: 0,
      voyageTime: '',
      waitingTime: '',
      distance: 0,
      averageSpeed: 0,
      reportOil: 0,
      calculationOil: 0,
    }
  );
  summary.voyageTime = convertMinutesToTimeString(summary.originVoyageMins);
  summary.waitingTime = convertMinutesToTimeString(summary.originWaitingMins);
  summary.averageSpeed = adjustPrecision(summary.averageSpeed, 2);
  summary.distance = adjustPrecision(summary.distance, 2);
  summary.reportOil = adjustPrecision(summary.reportOil, 2);
  summary.calculationOil = adjustPrecision(summary.calculationOil, 2);

  const consumptionRate = adjustPrecision(
    (summary.reportOil / summary.calculationOil) * 100,
    1
  );

  /* Functions */
  /**
   * @title api로 받은 데이터를 정제
   * @description 서버에서 받은 데이터 form을 변경
   */
  const parseDataForm = (data) => {
    const rows = data.map((row) => {
      const {
        id,
        startDate,
        endDate,
        operatingTime,
        waitingTime,
        speed,
        distance,
        reportOil,
        calculationOil,
      } = row;

      const [momentStartDate, momentEndDate] = [
        moment(startDate, 'YYYYMMDDHHmmss'),
        moment(endDate, 'YYYYMMDDHHmmss'),
      ];

      const beginDate = {
        day: momentStartDate.date(),
        hour: momentStartDate.hour(),
        min: momentStartDate.minute(),
      };

      const _endDate = {
        day: momentEndDate.date(),
        hour: momentEndDate.hour(),
        min: momentEndDate.minute(),
      };

      const _voyageString = `${parseInt(operatingTime / 60)}h ${
        operatingTime % 60
      }m`;
      const _waitingString = `${parseInt(waitingTime / 60)}h ${
        waitingTime % 60
      }m`;

      return {
        id,
        begin: beginDate,
        end: _endDate,
        voyageTime: _voyageString,
        waitingTime: _waitingString,
        originVoyageMins: operatingTime,
        originWaitingMins: waitingTime,
        averageSpeed: speed,
        distance: distance,
        reportOil: reportOil,
        calculationOil: calculationOil,
      };
    });

    return rows;
  };

  /**
   * @description 테이블 데이터를 서버에 저장하는 폼으로 변경
   */
  const reParseDataForm = (data) => {
    const parsedData = data.map((row) => {
      const { id = 0, begin, end, reportOil } = row;
      const momentStartDate = moment(
        reportMonth,
        moment.HTML5_FMT.DATETIME_LOCAL
      );
      const momentEndDate = moment(
        reportMonth,
        moment.HTML5_FMT.DATETIME_LOCAL
      );

      momentStartDate.date(begin.day);
      momentStartDate.hour(begin.hour);
      momentStartDate.minute(begin.min);

      momentEndDate.date(end.day);
      momentEndDate.hour(end.hour);
      momentEndDate.minute(end.min);

      const startDate = momentStartDate.format('YYYYMMDDHHmmss');
      const endDate = momentEndDate.format('YYYYMMDDHHmmss');

      return {
        id,
        startDate,
        endDate,
        reportOil,
      };
    });

    return parsedData;
  };

  /**
   * @title 소모량 계산 데이터 수신
   */
  const getCalcConsumptionPeriod = async () => {
    if (!reportMonth) return;
    const { status, data } = await CalcConsumptionApi.getCalcConsumptionPeriod(
      shipId,
      {
        date: reportMonthMoment.format('YYYY-MM'),
      }
    );
    if (status) {
      const parsingData = parseDataForm(data).sort((a, b) => {
        const prev = parsingDateObjectToMoment(a.begin);
        const curr = parsingDateObjectToMoment(b.begin);

        return prev.unix() - curr.unix();
      });
      setOriginCalcConsumption(parsingData);
    }

    tableKey.current = v1();
  };

  /**
   * @title 변환된 행 추가
   */
  const insertChangeRows = (rowIndex) => {
    const newIndex = parseInt(rowIndex);
    setChangeRow(changeRow.add(newIndex));
  };

  /**
   * @title 저장 처리
   */
  const handleSave = () => {
    const promises = [...upsertDataController(), ...deleteDataController()];

    Promise.all(promises)
      .then((resList) => {
        const failState = resList.some((res) => {
          const { status } = res;
          return !status;
        });

        if (failState) {
          MessageAlert.error('저장 실패');
        } else {
          MessageAlert.success('저장 성공');
          setDeletedRows(new Set());
          setChangeRow(new Set());
          getCalcConsumptionPeriod();
        }
      })
      .catch((err) => {
        MessageAlert.error('치명적인 에러 사이트 관리자에게 문의바랍니다.');
      });
  };

  /**
   * @title 저장 버튼 클릭시 insert update를 처리
   */
  const upsertDataController = () => {
    let filterData = [];
    changeRow.forEach((value) => {
      filterData.push(originCalcConsumption[value]);
    });

    const parsedData = reParseDataForm(filterData);
    const promises = parsedData.map((row) => {
      const { id } = row;

      if (id) {
        return CalcConsumptionApi.updateCalcConsumptionPeriod(shipId, id, row);
      } else {
        const { startDate, endDate, reportOil } = row;
        return CalcConsumptionApi.insertCalcConsumptionPeriod(shipId, {
          reportMonth: reportMonthMoment.format('YYYY-MM'),
          startDate,
          endDate,
          reportOil,
        });
      }
    });

    return promises;
  };

  /**
   * @title 삭제된 행을 기억해서 저장 클릭 시 삭제
   */
  const deleteDataController = () => {
    const promises = Array.from(deletedRows).map((row) => {
      const { id } = row;
      return CalcConsumptionApi.deleteCalcConsumptionPeriod(shipId, id);
    });

    return promises;
  };

  /**
   * @title 셀 변환 처리
   */
  const handleCellChange = (rowIndex, col, data) => {
    const newData = produce(originCalcConsumption, (draft) => {
      if (col.includes('begin') || col.includes('end')) {
        const [f, s] = col.split('-');
        draft[rowIndex][f][s] = parseFloat(data);
      } else {
        draft[rowIndex][col] = parseFloat(data);
      }
    });

    setOriginCalcConsumption(newData);
  };

  if (row === null) return <></>;

  /* variable */
  const { reportMonth } = row;
  const reportMonthMoment = moment(reportMonth, 'YYYY-MM');
  const [year, month] = [reportMonthMoment.year(), reportMonthMoment.month()];

  /**
   * @title 모달 Title에 들어가는 내용
   */
  const modalTitle = (
    <div className="modal-title-area">
      <div className="title-left-box title-box">
        <span className="emp">{year}</span>년{' '}
        <span className="emp">{month + 1}</span>월 소모량 계산
      </div>
      <div className="title-right-box title-box">
        <button
          className="default"
          onClick={() => {
            setReportDownloadModalVisible(true);
          }}
        >
          레포트 다운로드
        </button>
        {checkAvailableUIComponent(level, 1, [
          <button
            className="primary"
            onClick={() => {
              if (checkDateValidation()) {
                handleSave();
              } else {
                MessageAlert.error('입력 날짜를 확인하세요.');
              }
            }}
          >
            저장
          </button>,
        ])}
      </div>
    </div>
  );

  /**
   * @title 모달 Footer에 들어가는 내용
   */
  const footerContent = calcState ? (
    <div className="calc-result-box">
      <span className="label">{`소모율 : `}</span>
      <span className="value">{`${consumptionRate}%`}</span>

      <span className="slash">/</span>

      <span className="label">적정 여부 : </span>
      <span className={`value emp ${consumptionRate >= 120 ? 'over' : ''}`}>
        {consumptionRate >= 120 ? 'X' : 'O'}
      </span>
    </div>
  ) : (
    <button
      className="btn-calc-consumption"
      onClick={() => {
        const valid = checkDateValidation();

        if (valid) {
          setCalcState(true);
          handleCalcConsumption();
        } else {
          MessageAlert.error('입력 날짜를 확인하세요.');
        }
      }}
    >
      소모량 계산하기
    </button>
  );

  /* functions */
  /**
   * @title 행추가
   * @description 테이블의 행을 추가
   */
  const handleInsertRow = () => {
    const newRow = {
      id: null,
      begin: {
        day: null,
        hour: null,
        min: null,
      },
      end: {
        day: null,
        hour: null,
        min: null,
      },
      voyageTime: null,
      waitingTime: null,
      originVoyageMins: null,
      originWaitingMins: null,
      averageSpeed: null,
      reportOil: 0,
      calculationOil: null,
    };

    setOriginCalcConsumption([...originCalcConsumption, newRow]);
    setChangeRow(changeRow.add(originCalcConsumption.length));
  };

  /**
   * @title 행 삭제
   * @description 테이블의 행을 삭제하고 삭제된 행의 id가 있을 경우 이후
   * 저장시 api 처리를 위해 deltedRows 상태에 저장
   *
   */
  const handleDeleteRow = () => {
    let newOriginCalcConsumption = [...originCalcConsumption];
    const { length } = newOriginCalcConsumption;
    if (length === 0) return;
    const deletedRow = newOriginCalcConsumption.pop();
    const { id } = deletedRow;

    if (id) setDeletedRows(deletedRows.add(deletedRow));
    changeRow.delete(length - 1);
    setOriginCalcConsumption(newOriginCalcConsumption);
  };

  /**
   * @title 소요량 계산하기 버튼 처리 핸들러
   * @description 누르면 새롭게 추가된 행, 변경된 행에 대해서, 구간별 데이터를 검색 API로
   * 받아서 자동계산 데이터를 업데이트 한다.
   * ANCHOR
   */
  const handleCalcConsumption = () => {
    // 추가된 행, 변경된 행
    const promises = Array.from(changeRow).map((rowIndex) => {
      const targetRow = originCalcConsumption[rowIndex];
      const { begin, end, reportOil } = targetRow;
      const start = parsingDateStringForRequest(begin);
      const _end = parsingDateStringForRequest(end);

      return CalcConsumptionApi.getCalcConsumptionSearch(shipId, start, _end);
    });

    const changeRowArray = Array.from(changeRow);

    Promise.all(promises)
      .then((resList) => {
        let newOriginCalcConsumption = [...originCalcConsumption];

        resList.forEach((res, idx) => {
          const rowIndex = changeRowArray[idx];
          const { status, data } = res;
          if (status) {
            const {
              distance,
              averageSpeed,
              calculationOil,
              operatingTime,
              waitingTime,
            } = data;

            const _averageSpeed =
              typeof averageSpeed === 'string' ? 0 : averageSpeed;
            const convertedOperatingTime =
              convertMinutesToTimeString(operatingTime);
            const convertedWaitingTime =
              convertMinutesToTimeString(waitingTime);

            let { begin, end } = newOriginCalcConsumption[rowIndex];
            let newBegin = { ...begin };
            let newEnd = { ...end };

            newBegin.day = newBegin.day ?? 0;
            newBegin.hour = newBegin.hour ?? 0;
            newBegin.min = begin.min ?? 0;

            newEnd.day = newEnd.day ?? 0;
            newEnd.hour = newEnd.hour ?? 0;
            newEnd.min = newEnd.min ?? 0;

            newOriginCalcConsumption[rowIndex] = {
              ...newOriginCalcConsumption[rowIndex],
              begin: newBegin,
              end: newEnd,
              averageSpeed: _averageSpeed,
              calculationOil,
              distance,
              voyageTime: convertedOperatingTime,
              waitingTime: convertedWaitingTime,
              originVoyageMins: operatingTime,
              originWaitingMins: waitingTime,
            };
          }
        });

        setOriginCalcConsumption(newOriginCalcConsumption);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  /**
   * @title 월 데이터 파싱
   * @description date 객체를 받아서, 현재 년월에 대한 정보를 파싱하고, YYYYMMDDHHmmss 형태 스트링으로 반환
   * @param {Object} date {day, hour, min}
   */
  const parsingDateStringForRequest = (date) => {
    if (reportMonth) {
      const { day, hour, min } = date;
      const dateMoment = reportMonthMoment.clone();
      dateMoment.set({
        date: day,
        hour,
        minute: min,
      });

      return dateMoment.format('YYYYMMDDHHmmss');
    } else {
      return false;
    }
  };

  /**
   * @title 월 데이터 파싱
   * @description date 객체를 받아서, 현재 년월에 대한 정보를 파싱하고, YYYYMMDDHHmmss 형태 스트링으로 반환
   * @param {Object} date {day, hour, min}
   */
  const parsingDateObjectToMoment = (date) => {
    if (reportMonth) {
      const { day, hour, min } = date;
      const dateMoment = reportMonthMoment.clone();
      dateMoment.set({
        date: day,
        hour,
        minute: min,
      });

      if (dateMoment.isValid()) {
        return dateMoment;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  /**
   * @title 타당성 검사
   * @description 모든 열에 대해서 시간 타당성을 검증한다.
   * @return Success => true
   * @return Failure => false
   */
  const checkDateValidation = () => {
    let valid = true;
    let prevRow = null;

    originCalcConsumption.forEach((row) => {
      const { begin: currBegin, end: currEnd } = row;
      const currStartDateMoment = parsingDateObjectToMoment(currBegin);
      const currEndDateMoment = parsingDateObjectToMoment(currEnd);

      if (prevRow) {
        const { begin: prevBegin, end: prevEnd } = prevRow;

        const prevStartDateMoment = parsingDateObjectToMoment(prevBegin);
        const prevEndDateMoment = parsingDateObjectToMoment(prevEnd);

        // 현재 행의 begin 시간이 이전 행의 end 시간 이전일 때,
        if (currStartDateMoment.isBefore(prevEndDateMoment)) {
          valid = false;
        }
      }

      // 현재 행의 日 값이 입력 안됐을 때,
      if (currBegin.day === null || currEnd.day === null) {
        valid = false;
      }

      // 현재 행의 end 시간이 begin 시간보다 이전일 때,
      if (currEndDateMoment.isBefore(currStartDateMoment)) {
        valid = false;
      }

      prevRow = row;
    });

    return valid;
  };

  return (
    <>
      <Modal
        width={1160}
        centered={true}
        title={modalTitle}
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
        closable={null}
        className="calc-consumption-modal"
      >
        <div className="calc-consumption-modal-body">
          <div className="header-area">
            <div className="side">
              <img className="legend-image" src={AUTO_CALC_FIELD_LEGEND} />
              <span className="legend-label">자동계산값</span>
            </div>
            <div className="side">
              {checkAvailableUIComponent(level, 1, [
                <>
                  <button
                    className="default"
                    onClick={() => {
                      handleInsertRow();
                      setCalcState(false);
                    }}
                  >
                    행 추가
                  </button>
                  <button
                    className="default"
                    onClick={() => {
                      handleDeleteRow();
                      setCalcState(false);
                    }}
                  >
                    행 삭제
                  </button>
                </>,
              ])}
            </div>
          </div>
          <div className="table-area">
            <CalcConsumptionTable
              tableKey={tableKey}
              summary={summary}
              reportMonthMoment={reportMonthMoment}
              rowData={originCalcConsumption}
              setCalcState={setCalcState}
              insertChangeRows={insertChangeRows}
              handleCellChange={handleCellChange}
            />
          </div>
          <div className="footer-area">{footerContent}</div>
        </div>
      </Modal>
      <FileDownloadModal
        visible={reportDownloadModalVisible}
        setVisible={setReportDownloadModalVisible}
        handleClickExcel={() => {
          const date = reportMonthMoment.format('YYYYMMDDHHmmss');
          const url = `${downloadExcelUrl}${jsonToQueryParameter({ date })}`;
          downloadFromUrl(url);
          setReportDownloadModalVisible(false);
        }}
        handleClickPdf={() => {
          const date = reportMonthMoment.format('YYYYMMDDHHmmss');
          const url = `${downloadPdfUrl}${jsonToQueryParameter({ date })}`;
          downloadFromUrl(url);
          setReportDownloadModalVisible(false);
        }}
      />
    </>
  );
};

CalcConsumptionModal.defaultProps = {
  row: {
    reportMonth: '2020-10',
  },
  visible: false,
  setVisible: () => {},
};

export default CalcConsumptionModal;
