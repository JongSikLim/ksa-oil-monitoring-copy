import moment from 'moment';

export default {
  initalState: {
    code: null,
    depth: null,
    fairWay_1: null,
    fairWay_2: null,
    isAIS: null,
    kind_1: null,
    kind_2: null,
    length: null,
    manageCode: null,
    mmsi: null,
    mmsiStart: null,
    name: null,
    speedAverage: null,
    speedMaximum: null,
    weight: null,
    width: null,
  },
  /**
   * @title post, put 요청을 보내기 위한 함수
   * @param form form 데이터
   */
  parseBodyForm: (form) => {
    const parsedMmsiStart = moment(form.mmsiStart);
    const mmsiStartResult = parsedMmsiStart.isValid()
      ? parsedMmsiStart.format('YYYYMMDD000000')
      : null;
    return {
      isAIS: form.isAIS,
      fairWay_1: form.fairWay_1,
      fairWay_2: form.fairWay_2,
      speedAverage: form.speedAverage,
      speedMaximum: form.speedMaximum,
      mmsi: form.mmsi,
      mmsiStart: mmsiStartResult,
    };
  },
};
