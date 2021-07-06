//NOTE 각 KEY 별로 ISAIS, ISFERRY, AUTOCALC 상태 정의
/**
 * option
 * {
 *  isAIS.0 : false,
 *  isFerry : false,
 *  autoCalc : false,
 *  updated : false,
 *
 * }
 */
import LOCK_ICON from 'assets/svgs/btn_lock.svg';
import UNLOCK_ICON from 'assets/svgs/btn_unlock.svg';
import ADD_FILE from 'assets/svgs/btn_file-add.svg';
import CALCULATOR_ICON from 'assets/svgs/btn_calculate.svg';
import DROPDOWN_ICON from 'assets/svgs/icon_table_dropdown1.svg';
import RESET_ICON from 'assets/svgs/btn_reset.svg';

import moment from 'moment';
import { Input, InputNumber, Select } from 'antd';
import { debounce } from 'throttle-debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adjustPrecision as parseNumberPrecision,
  parseCommaInputNumber,
} from 'utils/esManager';

// const parentStateChangeDebounceController = debounce(500, (value, cb) => {
//   cb(value);
// });

const TempInputElement = ({ state, handleCellValueChangeController }) => {
  const [localState, setLocalState] = useState();

  useEffect(() => {
    setLocalState(state);
    return () => {
      setLocalState('');
    };
  }, [state]);

  const parentStateChangeDebounceController = (value) => {
    handleCellValueChangeController(value);
  };

  return (
    <Input
      className="reason-input-field"
      style={{
        border: 'none',
        backgroundColor: 'inherit',
        height: '100%',
      }}
      value={localState}
      onChange={(e) => {
        e.stopPropagation();
        const value = e.target.value;
        setLocalState(value);
        parentStateChangeDebounceController(
          value,
          handleCellValueChangeController
        );
      }}
    />
  );
};

export default {
  AIS: 'AIS',
  NOT_AIS: 'NOT_AIS',
  FERRY: 'FERRY',
  modifyMappingTable: {
    calculationOil: 'modifyCalculationOil',
    carryOverOil: 'modifyCarryOverOil',
    flightDistance: 'modifyFlightDistance',
    operatingTime: 'modifyOperatingTime',
    waitingTime: 'modifyWaitingTime',
  },
  summaryCols: [
    'supplyOil',
    'reportOil',
    'calculationOil',
    'operatingTime',
    'waitingTime',
    'voyageSpend',
    'flightDistance',
  ],
  options: {
    reportMonth: {
      title: <span>월</span>,
      width: ['7.84%', '7.85%', '7.86%'],
      className: 'strong',
      type: 'text',
      render: (text) => {
        const formattedText = moment(text).format('YYYY-MM');
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {formattedText}{' '}
            <img
              src={RESET_ICON}
              style={{ marginLeft: '7px', cursor: 'pointer' }}
            />
          </div>
        );
      },
    },
    supplyMount: {
      title: <span>공급량 (L)</span>,
      children: ['carryOverOil', 'supplyOil', 'totalSupply'],
    },
    carryOverOil: {
      title: <span>전월 이월</span>,
      width: ['7.79%', '7.79%', '7.80%'],
    },
    supplyOil: {
      title: <span>금월 공급</span>,
      width: ['7.17%', '7.18%', '7.19%'],
    },
    totalSupply: {
      title: <span>합계</span>,
      width: ['7.73%', '7.74%', '7.75%'],
    },
    consumptionOil: {
      title: <span>소모량 (L)</span>,
      children: ['reportOil', 'calculationOil'],
    },
    reportOil: {
      title: <span>보고량</span>,
      width: ['8.01%', '8.01%', '8.03%'],
    },
    calculationOil: {
      title: <span>산출량</span>,
      width: ['8.06%', '8.07%', '8.08%'],
    },
    remainOil: {
      title: <span>잔량</span>,
      children: ['rob'],
    },
    rob: {
      title: <span>이월량</span>,
      width: ['5.73%', '5.73%', '5.74%'],
    },
    voyageSpend: {
      title: (
        <span>
          항차당
          <br />
          연료소모량 (L)
        </span>
      ),
    },
    voyageTime: {
      title: <span>운항 시간 (hr)</span>,
      children: ['operatingTime', 'waitingTime'],
    },
    operatingTime: {
      title: <span>항해</span>,
      width: ['5.78%', null, null],
    },
    waitingTime: {
      title: <span>대기</span>,
      width: ['5.78%', null, null],
    },
    // NOTE AIS 미설치 필드 추가건
    drivingTime: {
      title: <span>운전 시간(hr)</span>,
      children: ['operatingMainEngine', 'operatingSubEngine'],
    },
    operatingMainEngine: {
      title: <span>주엔진</span>,
      width: [null, '5.79%', null],
    },
    operatingSubEngine: {
      title: <span>보조엔진</span>,
      width: [null, '5.79%', null],
    },
    flightCount: {
      title: (
        <span>
          운항 횟수 <br /> (왕복)
        </span>
      ),
      width: [null, null, '11.93%'],
    },
    flightDistance: {
      title: (
        <span>
          운항 거리 <br /> (마일){' '}
        </span>
      ),
      width: ['7.56%', '7.57%', null],
    },
    averageSpeed: {
      title: (
        <span>
          평균 속도 <br /> (노트)
        </span>
      ),
      width: ['5.01%', '5.01%', null],
    },
    consumptionRate: {
      title: <span>소모율 (%)</span>,
      width: ['6.12%', '6.12%', '6.13%'],
      className: 'consumptionRate',
    },
    adequate: {
      title: (
        <span>
          적정
          <br />
          여부
        </span>
      ),
      width: ['4.12%', '4.12%', '4.12%'],
      type: 'dropdown',
      className: 'adequate',
      render: function (text, record, rowIndex) {
        const { key, handleCellValueChange } = this;
        return (
          <Select
            bordered={false}
            value={text}
            suffixIcon={<img src={DROPDOWN_ICON} alt={'DROPDOWN ICON'} />}
            options={[
              { label: 'O', value: true },
              { label: 'X', value: false },
            ]}
            onChange={(value) => {
              handleCellValueChange(rowIndex, key, value);
            }}
          ></Select>
        );
      },
    },
    reason: {
      title: <span>초과 사유</span>,
      type: 'text',
      width: ['6.84%', '10.02%', '10.03%'],
      className: 'reason',
      render: function (text, record, rowIndex) {
        const { key, handleCellValueChange } = this;
        const handleCellValueChangeController = (value) => {
          handleCellValueChange(rowIndex, key, value);
        };
        return (
          <div className="input-field">
            <TempInputElement
              state={text}
              handleCellValueChangeController={handleCellValueChangeController}
            />
          </div>
        );
      },
    },
    calcConsumption: {
      title: (
        <span>
          소모량
          <br />
          계산
        </span>
      ),
      width: ['3.23%', null, null],
      type: 'modal',
      render: function (text, record, rowIndex) {
        const { consumptionRate } = record;

        return <img src={CALCULATOR_ICON} style={{ cursor: 'pointer' }} />;
      },
    },
    files: {
      title: (
        <span>
          파일
          <br />
          첨부
        </span>
      ),
      width: ['3.23%', '3.23%', '3.23%'],
      type: 'modal',
      render: function (text, record, rowIndex) {
        return <img src={ADD_FILE} style={{ cursor: 'pointer' }} />;
      },
    },
  },
  columnSet: {
    FERRY: [
      'reportMonth',
      'supplyMount',
      'consumptionOil',
      'remainOil',
      'voyageSpend',
      'flightCount',
      'consumptionRate',
      'adequate',
      'reason',
      'files',
    ],
    AIS: [
      'reportMonth',
      'supplyMount',
      'consumptionOil',
      'remainOil',
      'voyageTime',
      'flightDistance',
      'averageSpeed',
      'consumptionRate',
      'adequate',
      'reason',
      'calcConsumption',
      'files',
    ],
    NOT_AIS: [
      'reportMonth',
      'supplyMount',
      'consumptionOil',
      'remainOil',
      'drivingTime',
      'flightDistance',
      'consumptionRate',
      'adequate',
      'reason',
      'files',
    ],
  },
  lockState: {
    FERRY: [
      {
        carryOverOil: true,
      },
      {
        reportMonth: true,
        carryOverOil: true,
        totalSupply: true,
        calculationOil: true,
        rob: true,
        voyageSpend: true,
        averageSpeed: true,
        consumptionRate: true,
      },
    ],
    AIS: [
      {
        carryOverOil: true,
        calculationOil: true,
        operatingTime: true,
        waitingTime: true,
        flightDistance: true,
      },
      {
        reportMonth: true,
        carryOverOil: true,
        totalSupply: true,
        calculationOil: true,
        rob: true,
        operatingTime: true,
        waitingTime: true,
        flightDistance: true,
        averageSpeed: true,
        consumptionRate: true,
      },
    ],
    NOT_AIS: [
      {
        carryOverOil: true,
      },
      {
        reportMonth: true,
        carryOverOil: true,
        totalSupply: true,
        calculationOil: true,
        rob: true,
        averageSpeed: true,
        consumptionRate: true,
      },
    ],
  },
  /**
   * @title 컬럼 세트 반환
   * @description 각 선종에 맞는 컬럼 세트를 반환하는 함수
   * @param {*} isFerry
   * @param {*} isAIS
   * @returns
   * @deprecated typeAIS로 인해 제거
   */
  getColumnSet: function (isFerry, isAIS) {
    let set;

    if (isFerry) {
      set = this.isFerryCols;
    } else {
      if (isAIS) {
        set = this.isAisCols;
      } else {
        set = this.notAISCols;
      }
    }

    return set;
  },
  /**
   *
   * @param {*} lockState 자물쇠 잠김여부
   * @param {*} autoCalcState 자동계산 여부 lockState가 있으면 auto는 무조건 있다.
   */
  getColumns: function (
    type,
    cols,
    lockState,
    autoCalcState,
    handleClickLock,
    handleCellValueChange,
    handleClickFileAttachButton,
    handleClickCalcConsumptionButton,
    handleClickRefreshDataButton
  ) {
    const { options } = this;
    const columns = cols.map((key, idx) => {
      const { children = [] } = options[key];

      // 키 옵션 적용
      const keyOption = this.setColOption(
        type,
        key,
        options[key],
        lockState[key],
        autoCalcState[key],
        handleClickLock,
        handleCellValueChange,
        handleClickFileAttachButton,
        handleClickCalcConsumptionButton,
        handleClickRefreshDataButton
      );

      // 자식 속성 옵션 적용
      const childrenOptions = children.map((childKey) => {
        return this.setColOption(
          type,
          childKey,
          options[childKey],
          lockState[childKey],
          autoCalcState[childKey],
          handleClickLock,
          handleCellValueChange,
          handleClickFileAttachButton,
          handleClickCalcConsumptionButton,
          handleClickRefreshDataButton
        );
      });

      return {
        ...keyOption,
        children: childrenOptions ? childrenOptions : [],
      };
    });

    return columns;
  },
  /**
   * @title 기본 렌더 값
   * @description cell 이 기본적으로 렌더링되는 형식
   * @param text 값 텍스트
   * @param record row 데이터
   */
  defaultRender: function (text, record) {
    const { key, className, modifyMappingTable } = this; // bind 해서 사용
    const { id, shipId } = record;
    const disabled = className.includes('auto');
    const isModified = modifyMappingTable[key];
    const modified = record[isModified];
    const pKey = `${shipId}-${id}-${key}`;
    const precision = key === 'averageSpeed' ? 2 : 0;

    return (
      <div className={`input-field-wrapper`} key={pKey}>
        {modified ? (
          <span
            className="tag"
            style={{
              position: 'absolute',
              top: 0,
              border: '7px solid #2bc553',
              borderBottomColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          ></span>
        ) : (
          <></>
        )}

        <input
          type="text"
          className="table-cell-input-number"
          name={key}
          defaultValue={parseCommaInputNumber(
            parseNumberPrecision(text, precision)
          )}
          // defaultValue={parseNumberPrecision(text, precision)}
          disabled={disabled}
          onKeyUp={(e) => {
            e.target.value = parseCommaInputNumber(e.target.value);
          }}
        />
      </div>
    );
  },
  /**
   * @title 컬럼 속성 바인딩 함수
   * @description 컬럼에 속성을 바인딩한다.
   * @param {*} type
   * @param {*} key
   * @param {*} option
   * @param {*} targetLockState
   * @param {*} targetAutoCalcState
   * @param {*} handleClickLock
   * @param {*} handleCellValueChange
   * @returns
   */
  setColOption: function (
    type,
    key,
    option,
    targetLockState,
    targetAutoCalcState,
    handleClickLock,
    handleCellValueChange,
    handleClickFileAttachButton,
    handleClickCalcConsumptionButton,
    handleClickRefreshDataButton
  ) {
    const { title, width = [null], render } = option;
    let { className = '' } = option;
    const thText = (
      <div className="cell-box">
        {title}
        <span
          className="icon"
          style={{
            display: `${targetLockState === undefined ? 'none' : ''}`,
          }}
        >
          <img
            className="lock-icon"
            src={targetLockState ? LOCK_ICON : UNLOCK_ICON}
            onClick={() => {
              handleClickLock(key);
            }}
          />
        </span>
      </div>
    );

    // 자동계산 필드 클래스 바인딩
    className = this.autoColumnBinding(
      targetAutoCalcState,
      targetLockState,
      className
    );

    // className = this.updateLabelBinding(this.modifyMappingTable[key], this.reco)

    let newRender;

    // 렌더 함수 설정
    if (render) {
      newRender = render.bind({
        ...this,
        key,
        className,
        handleCellValueChange,
        handleClickFileAttachButton,
        handleClickCalcConsumptionButton,
        handleClickRefreshDataButton,
      });
    } else {
      const bindRender = this.defaultRender.bind({
        key,
        className,
        ...this,
      });

      newRender = bindRender;
    }

    // width 적용
    const widthType =
      type === this.FERRY ? width[2] : type === this.AIS ? width[0] : width[1];

    return {
      title: thText,
      dataIndex: key,
      className: className,
      width: widthType,
      render: newRender,
      onCell: (record, rowIndex) => {
        return {
          onChange: (e) => {
            let { name, value } = e.target;
            // if (!this.options[name].type) {
            //   value = parseNumberPrecision(value);
            // }
            handleCellValueChange(rowIndex, name, value);
          },
          onClick: (e) => {
            if (key === 'files') {
              handleClickFileAttachButton(rowIndex, record);
            } else if (key === 'calcConsumption') {
              handleClickCalcConsumptionButton(rowIndex, record);
            } else if (key === 'reportMonth') {
              //FIXME 새로고침 이벤트
              const {
                target: { nodeName },
              } = e;

              if (nodeName === 'IMG') {
                handleClickRefreshDataButton(rowIndex, record);
              }
            } else {
              return;
            }
          },
        };
      },
    };
  },

  /**
   * @title 자동 계산 클래스 바인딩
   * @description 컬럼에 자동 계산 여부를 바인딩한다.
   * @param {*} targetutoCalcState
   */
  autoColumnBinding(targetAutoCalcState, targetLockState, className) {
    let newClassName = className;
    // 자동계산키가 있으면 className에 auto 추가
    if (targetAutoCalcState) {
      newClassName += ' auto';

      //현재 잠금 상태가 해제되어있으면 auto class 해제
      if (targetLockState === false) {
        newClassName = newClassName.replace('auto', '');
      }
    }

    return newClassName;
  },

  /**
   * @title 라벨 업데이트 바인딩 함수
   * @description 데이터가 업데이트 되었는지 여부를 보여주는 함수
   * @param {*} hasModified
   * @param {*} isModifeid
   * @param {*} className
   */
  updateLabelBinding(hasModified, isModifeid, className) {
    let newClassName = className;

    if (hasModified && isModifeid) {
      newClassName += 'modified';
    }

    return newClassName;
  },
};
