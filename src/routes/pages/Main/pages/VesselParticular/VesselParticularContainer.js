import React, { useEffect, useState } from 'react';
import VesselParticularPresenter from './VesselParticularPresenter';

import { useDispatch, useSelector } from 'react-redux';
import actionCreator, {
  setVesselParticularInfosFacadeAction,
  selectVesselParticularFacadeAction,
} from 'redux/reducer/actionCreator';

import { ParticularAPI } from 'api';
import URL from 'api/apiContstant';

import { API_SERVER_URL } from 'utils';
import { downloadFromUrl } from 'utils/esManager';

import { message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { vesselParticular as SHParticular } from './templates/index';
import { engineParticular as ENParticular } from './templates/index';

const { DOWNLOAD_TA_REPORT_PDF, DOWNLOAD_TA_REPORT_EXCEL } = URL;
const vesselCategoryMatching = {
  CRUSE: ['여객선'],
  CARGO: ['화물선', '유조선', '예부선'],
  ETC: ['기타선', '도선'], //해당 종류만 제외하고 전부 출력
};

const VesselParticularContainer = () => {
  /* State */
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState(''); // 좌측 상단 선박 이름 검색 텍스트
  const [filterVesselList, setFilterVesselList] = useState([]); // searchText에 ㄷ의해 필터링 된 값
  const [vesselCategory, setVesselCategory] = useState('ALL'); // 좌측 상단 선박 카테고리 탭
  const [activePanel, setActivePanel] = useState('SH'); // 중앙 컨텐츠 활성화된 탭
  const [confirmSHModalVisible, setConfirmSHModalVisible] = useState(false); // SH 저장 모달 가시여부
  const [confirmENModalVisible, setConfirmENModalVisible] = useState(false); // EN 저장 모달 가시여부

  /* Redux State */
  const dispatch = useDispatch();
  const selectCompany = useSelector((state) => state.company.selectCompany);
  const selectVessel = useSelector((state) => state.vessel.selectVessel);
  const dataInfo = useSelector((state) => state.vessel.particular.gr);
  const [particularForm] = useForm(); // 선박제원, 엔진제원 저장을 위한 필드
  const particulars = useSelector((state) => state.vessel.particulars);
  const selectParticular = useSelector(
    (state) => state.vessel.selectParticular
  );
  const { shipId = '' } = selectVessel;

  /* Variables */
  const downloadTaPdfReportUrl =
    `${API_SERVER_URL}${DOWNLOAD_TA_REPORT_PDF}`.replace(':shipId', shipId);

  const downloadTaExcelReportUrl =
    `${API_SERVER_URL}${DOWNLOAD_TA_REPORT_EXCEL}`.replace(':shipId', shipId);

  // 좌측 선박 리스트 테이블 컬럼
  const tableColumns = [
    {
      title: '선박명',
      dataIndex: 'name',
      width: '228px',
      className: 'name',
      sorter: (a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (b.name > a.name) {
          return -1;
        }
        return 0;
      },
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      // render: () => {

      // }
    },
    {
      title: '선종',
      width: '68px',
      dataIndex: 'kind_1',
      className: 'kind_1',
      sorter: (a, b) => {
        if (a.kind_1 > b.kind_1) {
          return 1;
        }
        if (b.kind_1 > a.kind_1) {
          return -1;
        }
        return 0;
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '최신 업데이트',
      dataIndex: 'STATUS',
      className: 'status',
      width: '133px',
      render: (text, record, index) => {
        return (
          <div className="valid-box">
            <div className="valid-item">
              {/* //FIXME 조건 3가지로 변경 필요 */}
              {record.sh === true && (
                <div className="valid-text success">SH</div>
              )}
              {record.sh === false && <div className="valid-text fail">SH</div>}
              {record.sh === 'draft' && (
                <div className="valid-text draft">SH</div>
              )}
            </div>
            <div className="valid-item">
              {record.en === true && (
                <div className="valid-text success">EN</div>
              )}
              {record.en === false && <div className="valid-text fail">EN</div>}
              {record.en === 'draft' && (
                <div className="valid-text draft">EN</div>
              )}
            </div>
            <div className="valid-item">
              {record.gr === true && (
                <div className="valid-text success">GR</div>
              )}
              {record.gr === false && <div className="valid-text fail">GR</div>}
              {record.gr === 'draft' && (
                <div className="valid-text draft">GR</div>
              )}
            </div>
            <div className="valid-item">
              {record.ta === true && (
                <div className="valid-text success">TA</div>
              )}
              {record.ta === false && <div className="valid-text fail">TA</div>}
              {record.ta === 'draft' && (
                <div className="valid-text draft">TA</div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  /* Functions */
  const handleChange = (pagination, filters, sorter) => {};

  /**
   * @title 선박 클릭
   * @description 선박 클릭에 대한 이벤트 처리
   * @param v 선택된 선박 객체
   */
  const handleClickVessel = (v) => {
    if (selectVessel.shipId === v.shipId) return;
    selectVesselParticularFacadeAction(dispatch, v);
  };

  const handleSHSave = () => {
    particularForm
      .validateFields()
      .then((res) => {
        setConfirmSHModalVisible(true);
      })
      .catch((errorInfo) => {
        const { values, errorFields } = errorInfo;
        const { isAIS } = values;
        let newErrorFields = [...errorFields];

        if (isAIS === false) {
          newErrorFields = newErrorFields.filter((err) => {
            const fieldName = err.name[0];
            return fieldName !== 'mmsi';
          });
        }

        if (newErrorFields.length === 0) {
          setConfirmSHModalVisible(true);
        } else {
          const errorFieldKeys = newErrorFields.map((err) => {
            return SHParticular[err.name[0]].label;
          });

          Modal.error({
            title: '입력 양식 에러',
            content: (
              <>
                {errorFieldKeys.map((err) => {
                  return <span>{`[${err}] `}</span>;
                })}
                값이 잘못입력되었습니다.
              </>
            ),
          });
        }
      });
  };

  const handleENSave = async () => {
    try {
      const values = await particularForm.validateFields();
      setConfirmENModalVisible(true);
    } catch (errorInfo) {
      const { errorFields } = errorInfo;
      const errorFieldKeys = errorFields.map((err) => {
        return ENParticular[err.name[0]].label;
      });

      Modal.error({
        title: '저장불가',
        content: '입력되지 않은 항목이 있습니다.',
      });
    }
  };

  /**
   * @title 선속소모량 특성곡선(GR) 저장
   * @description GR 탭 데이터를 저장한다. origin 상태에 따라서 POST, PUT 요청을 날린다.
   */
  const handleGRSave = () => {
    const { dataStatus, dataRate } = dataInfo;

    if (dataStatus === 'origin') {
      ParticularAPI.insertGRFuelConsumption(shipId, {
        rate: dataRate,
      }).then((res) => {
        if (res) {
          message.success('저장 성공!');
        } else {
          message.error('저장에 실패했습니다.');
        }
      });
    } else if (dataStatus === 'modify') {
      ParticularAPI.updateGRFuelConsumption(shipId, {
        rate: dataRate,
      }).then((res) => {
        if (res) {
          message.success('저장 성공!');
        } else {
          message.error('저장에 실패했습니다.');
        }
      });
    } else {
      throw new Error('선속 소모량 곡선 업데이트 에러');
    }
  };

  /**
   * @title 소요량 기준표(TA) PDF 다운로드
   * @description
   */
  const handleDownloadTaPdfReport = () => {
    const url = `${downloadTaPdfReportUrl}`;

    downloadFromUrl(url);
  };

  /**
   * @title 소요량 기준표(TA) EXCEL 다운로드
   * @description
   */
  const handleDownloadTaExcelReport = () => {
    const url = `${downloadTaExcelReportUrl}`;

    downloadFromUrl(url);
  };

  //SECTION 훅 처리

  /* Hooks */
  useEffect(() => {
    const filterParticularList = particulars
      .filter((v) => {
        const { kind_1, kind_2 } = v;

        if (vesselCategory === 'ALL') return true;
        else if (vesselCategory === 'ETC') {
          if (
            kind_2 === '도선' ||
            (!vesselCategoryMatching.CARGO.includes(kind_1) &&
              !vesselCategoryMatching.CRUSE.includes(kind_1))
          )
            return true;
        } else {
          if (kind_2 === '도선') return false;
          return vesselCategoryMatching[vesselCategory].includes(kind_1);
        }
      })
      .filter((v) => {
        if (v['name'].includes(searchText) || v['code'].includes(searchText)) {
          return true;
        }
      })
      .map((v) => {
        return v;
      });

    setFilterVesselList(filterParticularList);
  }, [searchText, particulars, vesselCategory]);

  useEffect(() => {
    let vesselParticular = ParticularAPI.getVesselParticular(shipId);
    let engineParticular = ParticularAPI.getEngineParticular(shipId);

    Promise.all([vesselParticular, engineParticular])
      .then((res) => {
        setVesselParticularInfosFacadeAction(dispatch, [
          res[0].rows,
          res[1].rows,
          selectCompany,
        ]);
      })
      .catch((err) => {});

    return () => {};
  }, [selectParticular]);

  return (
    <VesselParticularPresenter
      {...{
        tableColumns,
        filterVesselList,
        searching,
        setSearching,
        setSearchText,
        vesselCategory,
        setVesselCategory,
        handleChange,
        activePanel,
        setActivePanel,
        particularForm,
        handleClickVessel,
        selectVessel,
        handleSHSave,
        handleENSave,
        handleGRSave,
        selectParticular,
        handleDownloadTaPdfReport,
        handleDownloadTaExcelReport,
        confirmSHModalVisible,
        setConfirmSHModalVisible,
        confirmENModalVisible,
        setConfirmENModalVisible,
      }}
    />
  );
};

export default VesselParticularContainer;
