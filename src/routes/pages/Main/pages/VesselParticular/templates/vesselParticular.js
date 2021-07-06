//NOTE 제원 키들은 API에서 나오는 키와 맞춘다.
const emptyLabel = '　';

export default {
  vesselName: {
    cKey: 'name',
    label: '선명',
    type: 'string',
    className: 'vesselName',
    disabled: true,
    defaultValue: 'GRAND ACE',
  },
  vesselType: {
    cKey: 'kind_1',
    label: '선종',
    type: 'string',
    addonBefore: '대',
    className: 'vesselType',
    disabled: true,
  },
  vesselTypeSub: {
    cKey: 'kind_2',
    label: emptyLabel,
    type: 'string',
    addonBefore: '중',
    className: 'vesselNameSub',
    disabled: true,
  },
  vesselNumber: {
    cKey: 'code',
    label: '선박 번호',
    type: 'string',
    className: 'vesselNumber',
    disabled: true,
  },
  manageNumber: {
    cKey: 'manageCode',
    label: '관리 번호',
    type: 'string',
    className: 'manageNumber',
    disabled: true,
  },
  usableAIS: {
    cKey: 'isAIS',
    label: 'AIS 설치',
    type: 'dropdown',
    className: 'usableAIS',
    options: [
      {
        label: '설치',
        value: true,
      },
      {
        label: '미설치',
        value: false,
      },
    ],
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  fairWay_1: {
    cKey: 'fairWay_1',
    label: '운항 항로',
    // subLabel: emptyLabel,
    gutterText: '－',
    type: 'string',
    className: 'fairWay_1',
  },
  fairWay_2: {
    cKey: 'fairWay_2',
    label: emptyLabel,
    // subLabel: emptyLabel,
    type: 'string',
    className: 'fairWay_2',
  },
  length: {
    cKey: 'length',
    label: '길이',
    type: 'number',
    unit: 'm',
    className: 'length',
    disabled: true,
  },
  width: {
    cKey: 'width',
    label: '너비',
    type: 'number',
    unit: 'm',
    className: 'width',
    disabled: true,
  },
  depth: {
    cKey: 'depth',
    label: '깊이',
    type: 'number',
    unit: 'm',
    className: 'manageNumber',
    disabled: true,
  },
  grossTonnage: {
    cKey: 'weight',
    label: '총톤수',
    type: 'number',
    unit: '톤',
    className: 'grossTonnage',
    disabled: true,
  },
  speedAverage: {
    cKey: 'speedAverage',
    label: '평균 항해 속도',
    type: 'number',
    unit: '노트',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
    className: 'speedAverage',
  },
  speedMaximum: {
    cKey: 'speedMaximum',
    label: '최대 항해 속도',
    type: 'number',
    unit: '노트',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
    className: 'speedMaximum',
  },
  mmsi: {
    cKey: 'mmsi',
    label: 'MMSI',
    type: 'string',
    className: 'mmsi',
    toggle: true,
    disabled: false,
    rules: [
      ({ getFieldValue }) => ({
        validator(_, value) {
          const isAIS = getFieldValue('isAIS');

          if (isAIS === false) {
            return Promise.resolve();
          } else {
            if (value === '' || value === null) {
              return Promise.reject('AIS 설치 선박은 MMSI 값 필수입니다.');
            } else {
              return Promise.resolve();
            }
          }
        },
      }),
    ],
  },
  mmsiStart: {
    cKey: 'mmsiStart',
    label: 'AIS 수신일',
    type: 'datetime',
    className: 'mmsiStart',
    toggle: true,
    disabled: false,
    resetIcon: true,
    rules: [
      ({ getFieldValue }) => ({
        validator(_, value) {
          const isAIS = getFieldValue('isAIS');

          if (isAIS === false) {
            return Promise.resolve();
          } else {
            if (value === '' || value === null) {
              return Promise.reject('AIS 설치 선박은 시작일 값 필수입니다.');
            } else {
              return Promise.resolve();
            }
          }
        },
      }),
    ],
  },
};
