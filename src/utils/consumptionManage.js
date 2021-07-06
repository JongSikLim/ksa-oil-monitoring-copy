import produce from 'immer';
import {
  adjustPrecision as parseNumberPrecision,
  parseCommaInputNumber,
} from './esManager';
import { checkNaN } from './esManager';
import config from '../routes/pages/Main/pages/ConsumptionMonitoring/templates/config';

export default class ConsumptionManger {
  constructor() {
    if (!ConsumptionManger.instance) {
      ConsumptionManger.instance = this;
    }

    return ConsumptionManger.instance;
  }
  // 행 자동 계산
  calcRow = (row) => {
    let newRow = { ...row };

    /**
       *  totalSupply	carryOverOil + supplyOil	carryOverOil	carryOverOil	carryOverOil				
          calculationOil	도선 : flightCount * voyageSpend || AIS설치, 미설치 :평균속도를 기준으로 자동 계산							
          rob	"totalSupply - reportOil
          "							
          operatingTime	AIS 데이터 기반 자동입력							
          waitingTime	AIS 데이터 기반 자동입력							
          flightDistance	AIS 데이터 기반 자동입력							
          averageSpeed	operatingTime +							
          consumptionRate	reportOil / calculationOil  ||  적정범위 이상일 경우 빨간색							
          adequate	최초엔 수정 불가하나 초과사유에 글자 입력하면 그때 disabled 해제
        */

    newRow.totalSupply = parseNumberPrecision(
      newRow.carryOverOil + newRow.supplyOil,
      2
    );
    newRow.rob = parseNumberPrecision(newRow.totalSupply - newRow.reportOil, 2);

    // FIXME 추후에 자동 계산을 프론트엔드에서도 해야할 경우에 해제
    return newRow;

    // if (newRow.hasOwnProperty('averageSpeed')) {
    //   newRow.averageSpeed = checkNaN(
    //     newRow.flightDistance / (newRow.operatingTime - newRow.waitingTime)
    //   );
    // }

    // if (newRow.hasOwnProperty('consumptionRate')) {
    //   newRow.consumptionRate = checkNaN(
    //     (newRow.reportOil / newRow.calculationOil) * 100
    //   );
    // }

    // newRow.adequate = newRow.consumptionRate >= 120 ? false : true;
    // return newRow;
  };

  // 연쇄 계산
  cascadeRob = (prevRow, nowRow) => {
    // FIXME 추후에 자동 계산을 프론트엔드에서도 해야할 경우에 해제
    return nowRow;

    if (!prevRow) return nowRow;
    let newRow = { ...nowRow };
    newRow.carryOverOil = prevRow.rob;

    return newRow;
  };

  // 최초 행 계산
  initCalcRows = (consumptions) => {
    const { calcRow, cascadeRob } = this;
    let newRows = consumptions.map((r) => {
      try {
        let newRow = calcRow(r);
        return newRow;
      } catch (error) {
        console.log('error: ', error);
      }
    });

    for (let i = 0; i < newRows.length; i++) {
      newRows[i] = cascadeRob(newRows[i - 1], newRows[i]);
    }

    return newRows;
  };

  /**
   * @title 선박연료유관리테이블 합계 계산
   * @description
   */
  calcSummary = (consumptions) => {
    console.log('CALLME');
    if (consumptions.length === 0) return [];

    let summary = consumptions.reduce((prev, current) => {
      const keys = Object.keys(prev);
      let newObject = { ...prev };

      keys.forEach((key) => {
        if (config.summaryCols.includes(key)) {
          let newVal = parseNumberPrecision(newObject[key] + current[key], 0);

          newObject[key] = newVal;
        } else {
          newObject[key] = null;
        }
      });

      return newObject;
    });

    summary = produce(summary, (draft) => {
      const keys = Object.keys(draft);

      keys.forEach((key, index) => {
        if (config.summaryCols.includes(key) === false) {
          delete draft[key];
        } else {
          // console.log(`${key} = `, summary[key]);
          draft[key] = parseCommaInputNumber(summary[key]);
        }
      });

      draft.reportMonth = '합계';

      //NOTE 2021-05-14 평균속도 합계에서 제거
      // draft.averageSpeed = parseInt(summary.averageSpeed / consumptions.length);

      delete draft.files;
    });

    return summary;
  };
}
