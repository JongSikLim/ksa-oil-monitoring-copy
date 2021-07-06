//NOTE 제원 키들은 API에서 나오는 키와 맞춘다.

const emptyLabel = '　';

export default {
  // SECTION 주엔진

  mainEngineCompany: {
    cKey: 'mainEngineCompany',
    label: '제조사',
    type: 'string',
    className: 'meMaker',
    rules: [
      {
        required: true,
        message: '',
      },
    ],
  },
  mainEngineModel: {
    cKey: 'mainEngineModel',
    label: '모델',
    type: 'string',
    className: 'meModel',
    rules: [
      {
        required: true,
        message: '',
      },
    ],
    dropdownMenu: [],
  },
  mainEngineLoad: {
    cKey: 'mainEngineLoad',
    label: '엔진평균부하',
    unit: '%',
    type: 'number',
    minValue: 1,
    maxValue: 99,
    precision: 0,
    className: 'maxEngineLoad',
    defaultValue: 0,
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  speedAverage: {
    cKey: 'speedAverage',
    label: '평균운항속도',
    unit: '노트',
    type: 'number',
    className: 'averageVoyageSpeed',
    disabled: true,
  },
  speedMaximum: {
    cKey: 'speedMaximum',
    label: '최대운항속도',
    unit: '노트',
    type: 'number',
    className: 'maxVoyageSpeed',
    disabled: true,
  },

  mainEnginePower: {
    cKey: 'mainEnginePower',
    label: '엔진 출력',
    subLabel: '엔진 1대 출력',
    type: 'number',
    className: 'power',
    gutterText: '×',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  mainEngineUnit: {
    cKey: 'mainEngineUnit',
    label: emptyLabel,
    subLabel: '단위',
    type: 'dropdown',
    className: 'unit',
    gutterText: '×',
    options: [
      { label: 'KW', value: 'KW' },
      { label: 'BHP', value: 'BHP' },
    ],
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  mainEngineAmount: {
    cKey: 'mainEngineAmount',
    label: emptyLabel,
    subLabel: '엔진 대수 (set)',
    type: 'dropdown',
    className: 'amount',
    gutterText: '＝',
    options: [
      { label: 1, value: 1 },
      { label: 2, value: 2 },
      { label: 3, value: 3 },
      { label: 4, value: 4 },
      { label: 5, value: 5 },
    ],
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },

  mainEngineOutput: {
    cKey: 'mainEngineOutput',
    label: emptyLabel,
    subLabel: emptyLabel,
    type: 'number',
    className: 'maxPower',
    disabled: true,
    suffix: 'kw',
    style: {
      color: 'rgb(17 115 253 / 80%)',
    },
  },

  consumption: {
    cKey: 'consumption',
    label: '부하별 연료소모량(엔진 1대당)',
    type: 'mainEngineConsumption',
    dataSource: [],
    className: 'consumption',
  },

  // SECTION 보조엔진
  subEngineCompany: {
    cKey: 'subEngineCompany',
    label: '제조사',
    type: 'string',
    className: 'subMaker',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  subEngineModel: {
    cKey: 'subEngineModel',
    label: '모델',
    type: 'string',
    className: 'subModel',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  subEnginePower: {
    cKey: 'subEnginePower',
    label: '엔진 출력',
    subLabel: '엔진 1대 출력',
    type: 'number',
    gutterText: '×',
    className: 'subPower',
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  subEngineUnit: {
    cKey: 'subEngineUnit',
    label: emptyLabel,
    subLabel: '단위',
    type: 'dropdown',
    gutterText: '×',
    className: 'subUnit',
    options: [
      { label: 'KW', value: 'KW' },
      { label: 'BHP', value: 'BHP' },
    ],
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },
  subEngineAmount: {
    cKey: 'subEngineAmount',
    label: emptyLabel,
    subLabel: '엔진 대수 (set)',
    gutterText: '＝',
    type: 'dropdown',
    className: 'subAmount',
    options: [
      { label: 1, value: 1 },
      { label: 2, value: 2 },
      { label: 3, value: 3 },
      { label: 4, value: 4 },
      { label: 5, value: 5 },
    ],
    rules: [
      {
        required: true,
        message: '필수 값 입니다.',
      },
    ],
  },

  subEngineOutput: {
    cKey: 'subEngineOutput',
    label: emptyLabel,
    subLabel: emptyLabel,
    type: 'number',
    className: 'subMaxPower',
    disabled: true,
    suffix: 'kw',
    style: {
      color: 'rgb(17 115 253 / 80%)',
    },
  },

  subConsumption: {
    cKey: 'subConsumption',
    label: '부하별 연료소모량',
    type: 'subEngineConsumption',
    dataSource: [],
    className: 'subConsumption',
  },

  voyageMainEngineFuel: {
    cKey: 'voyageMainEngineFuel',
    label: '항차당 평균연료소모량',
    type: 'number',
    unit: 'L',
    className: 'voyageMainEngineFuel',
    disabled: true,
  },

  voyageSubEngineFuel: {
    cKey: 'voyageSubEngineFuel',
    label: '항차당 평균연료소모량',
    type: 'number',
    unit: 'L',
    className: 'voyageSubEngineFuel',
    disabled: true,
  },
};
