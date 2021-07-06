import { Empty } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { v4 } from 'uuid';
import CalcConsumptionTr from './CalcConsumptionTr';
import { adjustPrecision } from 'utils/esManager';

/* Functions */

/**
 * @title 시간 값 변경
 * @description 항해, 대기 시간을 ui 데이터에 맞게 필터링한다.
 * @param min
 */
const convertMinutesToTimeString = (min) => {
  return `${parseInt(min / 60)}h ${parseInt(min % 60)}m`;
};

const CalcConsumptionTable = ({
  tableKey,
  summary,
  reportMonthMoment,
  rowData,
  setCalcState,
  insertChangeRows,
  handleCellChange,
}) => {
  /* state  */
  const tbodyRef = useRef();
  const trRefList = useRef([]);

  /* Variable */
  const daysInMonth = reportMonthMoment.daysInMonth();

  const trList = rowData.map((row, idx) => {
    const el = (
      <CalcConsumptionTr
        key={`${tableKey.current}-${idx}`}
        row={row}
        idx={idx}
        root={tbodyRef}
        ref={trRefList[idx]}
        daysInMonth={daysInMonth}
      />
    );
    return el;
  });

  const colGroup = (
    <colgroup>
      <col span={6} className="dateTime" />
      <col span={2} className="auto" />
      <col span={1} className="auto" />
      <col span={1} />
      <col span={1} className="auto" />
      <col width="17px" />
    </colgroup>
  );

  const colBodyGroup = (
    <colgroup>
      <col span={6} className="dateTime" />
      <col span={2} className="auto" />
      <col span={1} className="auto" />
      <col span={1} className="auto" />
      <col span={1} />
      <col span={1} className="auto" />
    </colgroup>
  );

  return (
    <div className="cc-table-container">
      <table className="cc-header-table cc-common-table">
        {colGroup}
        <thead>
          <tr>
            <th colSpan={3}>시작</th>
            <th colSpan={3}>끝</th>
            <th colSpan={2}>운항 시간 (hr)</th>
            <th rowSpan={2}>
              운항거리
              <br />
              (mile){' '}
            </th>
            <th rowSpan={2}>
              평균속도
              <br />
              (노트){' '}
            </th>
            <th colSpan={2}>소모량</th>
            <th rowSpan={2}></th>
          </tr>
          <tr>
            <th>일</th>
            <th>시간</th>
            <th>분</th>
            <th>일</th>
            <th>시간</th>
            <th>분</th>
            <th>항해</th>
            <th>대기</th>
            <th>보고량</th>
            <th>산출량</th>
          </tr>
        </thead>
      </table>
      <div className="cc-body-table-wrapper">
        {trList.length === 0 ? (
          <Empty />
        ) : (
          <table
            className="cc-body-table cc-common-table"
            onChange={(e) => {
              const { id, rowidx, columnkey } = e.target.dataset;
              const value = e.target.value;

              insertChangeRows(parseInt(rowidx));
              handleCellChange(parseInt(rowidx), columnkey, value);
            }}
            onFocus={(e) => {
              setCalcState(false);
            }}
          >
            {colBodyGroup}
            <tbody>{trList}</tbody>
          </table>
        )}
      </div>
      <div className="cc-footer-table-wrapper">
        <table className="cc-body-table cc-common-table">
          {/* {footerColGroup} */}
          <tbody>
            <tr>
              <th colSpan={6}>합계</th>
              <th>{summary.voyageTime}</th>
              <th>{summary.waitingTime}</th>
              <th>{summary.distance}</th>
              <th></th>
              <th>{summary.reportOil}</th>
              <th>{summary.calculationOil}</th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
CalcConsumptionTable.defaultProps = {
  rowData: Array(0).fill({}),
};
export default React.memo(CalcConsumptionTable);
