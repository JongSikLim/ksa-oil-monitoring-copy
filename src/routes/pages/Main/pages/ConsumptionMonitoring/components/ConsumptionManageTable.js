import React, { useCallback, useEffect, useState } from 'react';
import config from '../templates/config';
import produce from 'immer';
import moment from 'moment';
import { debounce } from 'throttle-debounce';

import consumptionApi from 'api/consumptionApi';
import MessageAlert from 'utils/MessageAlert';
import ConsumptionManger from 'utils/consumptionManage';

import { batch, useSelector } from 'react-redux';
import { newConsumption } from 'redux/reducer/consumption';
import { CalcConsumptionApi } from 'api';

import { Modal, Table } from 'antd';
import { FileUploadModal } from 'components/dataEntry';
import CalcConsumptionModal from './CalcConsumptionModal';
import TABLE_LEGEND from 'assets/svgs/icon_table_legend1.svg';
import TABLE_LEGEND_2 from 'assets/svgs/icon_table_legend2.svg';

import { checkAvailableUIComponent } from 'utils/authorizationManager';
import { uncomma } from 'utils/esManager';

const consumptionManager = new ConsumptionManger();
const { calcRow, cascadeRob } = consumptionManager;
const ADEQUATE_VALUE = 120;

const ConsumptionManageTable = ({
  shipId,
  typeAIS,
  requestYear,
  changeRows,
  setChangeRows,
  newConsumptions,
  setNewCosumptions,
  getNewConsumptions,
}) => {
  /* Redux State */
  const { level } = useSelector((state) => state.session.user);
  const summary = useSelector((state) => state.consumption.summary);

  /* State */
  const [lockState, setLockState] = useState({}); // 필드별 잠김 여부 thead 에서만 사용
  const [autoCalcState, setAutoCalcState] = useState({});
  const [vesselType, setVesselType] = useState('');
  const [fileAttachModalVisible, setFileAttachModalVisible] = useState(false);
  const [rowFiles, setRowFiles] = useState([]);
  const [selectedManageId, setSelectedManageId] = useState(null);
  const [selectedRow, setSelectedRow] = useState({ reportMonth: null });
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [calcConsumptionModalVisible, setCalcConsumptionModalVisible] =
    useState(false);
  const [warningRecalcModalVisible, setWarningRecalcModalVisible] =
    useState(false);

  /* Functions */
  /**
   * @title 락버튼 제어 함수
   * @description 자동계산 필드의 잠금 버튼을 잠금/해제 핸들링한다.
   * @param {*} key
   */
  const handleClickLock = (key) => {
    let newLockState = { ...lockState };
    newLockState[key] = !newLockState[key];

    setLockState(newLockState);
  };

  /**
   * @title 표 데이터 변경 처리 함수
   * @description 표 데이터의 변경을 처리한다. debouncing 기법으로 딜레이 처리한다.
   * @param {*} rowIndex
   * @param {*} key
   * @param {*} value
   */
  const handleCellValueChange = useCallback(
    debounce(200, (rowIndex, key, value) => {
      batch(() => {
        setChangeRows(changeRows.add(rowIndex));
        setNewCosumptions(
          produce(newConsumptions, (draft) => {
            if (config.options[key].type === undefined) {
              value = parseFloat(uncomma(value));
            }

            draft[rowIndex][key] = value;
            draft[rowIndex] = calcRow(draft[rowIndex]);

            //FIXME 프론트에서 전월 이월 데이터 수정해야할 경우 활성화
            // for (let i = rowIndex; i < newConsumptions.length; i++) {
            //   draft[i] = cascadeRob(draft[i - 1], draft[i]);
            // }
          })
        );
      });
    }),
    [newConsumptions]
  );

  const handleRefreshOil = () => {
    const { reportMonth } = selectedRow;
    const requestFormat = moment(reportMonth, 'YYYY-MM-DDTHH:mm:ss').format(
      'YYYYMMDDHHmmss'
    );
    const loadModal = Modal.success({
      centered: true,
      maskClosable: true,
      modalRender: () => {
        return (
          <div className="loading-modal-container">
            <div className="loading-spin-area">
              <div className="custom-loader"></div>
            </div>
            <div className="text-area">
              <div className="title">산출량 계산중…</div>
              <div className="sub-title">(최대 5분 소요)</div>
            </div>
          </div>
        );
      },
    });

    CalcConsumptionApi.reCalculationConsumptionInfo(shipId, requestFormat).then(
      (res) => {
        if (res) {
          MessageAlert.success('산출량 재계산 완료!');
          getNewConsumptions(requestYear);
        } else {
          MessageAlert.error('산출량 재계산 실패');
        }
        loadModal.destroy();
      }
    );
  };

  /**
   * @title 산출량 재계산 버튼 클릭 처리
   * @description 버튼 클릭 시, 확인 모달을 띄운다.
   */
  const handleClickRefreshDataButton = useCallback(
    (rowIndex, record) => {
      const { id, files } = record;

      batch(() => {
        setWarningRecalcModalVisible(true);
        // setRowFiles(files);
        setSelectedManageId(id);
        setSelectedRow(record);
        setSelectedRowIndex(rowIndex);
      });
    },
    [shipId]
  );

  /**
   * @description 파일 첨부 버튼 클릭 이벤트 핸들러
   */
  const handleClickFileAttachButton = useCallback((rowIndex, record) => {
    const { id, files } = record;

    batch(() => {
      setFileAttachModalVisible(true);
      setRowFiles(files);
      setSelectedManageId(id);
      setSelectedRow(record);
      setSelectedRowIndex(rowIndex);
    });
  }, []);

  /**
   * @title 소요량계산 버튼 클릭 핸들러
   * @description 소요량 계산 버튼을 클릭했을때, 선택된 행의 정보를 상태에 저장하고 모달 활성화
   * @param rowIndex 행 인덱스
   * @param record 행 데이터
   */
  const handleClickCalcConsumptionButton = useCallback((rowIndex, record) => {
    batch(() => {
      setCalcConsumptionModalVisible(true);
      setSelectedRow(record);
      setSelectedRowIndex(rowIndex);
    });
  });

  const columnSet = config.columnSet[vesselType] ?? [];

  /**
   * NOTE 컬럼에 바인딩할 객체들을 해당 프로퍼티에 할당
   */
  const columns = config.getColumns(
    vesselType,
    columnSet,
    lockState,
    autoCalcState,
    handleClickLock,
    handleCellValueChange,
    handleClickFileAttachButton,
    handleClickCalcConsumptionButton,
    handleClickRefreshDataButton
  );

  /**
   * footer 테이블 컬럼
   */
  const footerColumns = columns.map((c) => {
    const newCol = {
      ...c,
      children: c.children.map((_c) => ({
        ..._c,
        render: null,
      })),
    };

    return {
      ...newCol,
      render: null,
    };
  });

  /**
   * 행 추가 처리 이벤트
   *
   */
  const handleInsertConsumption = () => {
    let _newConsumption = calcRow({ ...newConsumption });

    batch(() => {
      const length = newConsumptions.length;

      setChangeRows(changeRows.add(length));

      let prevReportMonth, newMonth;
      if (length < 12) {
        if (length) {
          prevReportMonth = newConsumptions[length - 1].reportMonth;
          newMonth = moment(prevReportMonth).add(1, 'months').hour(0);
        } else {
          newMonth = moment(`${requestYear}-01`, 'YYYY-MM');
        }

        _newConsumption.reportMonth = newMonth.format('YYYY-MM-DDTHH:mm:ss');

        setNewCosumptions([...newConsumptions, _newConsumption]);
      }
    });
  };

  /**
   * 행 삭제 처리 이벤트
   * @returns
   */
  const handleDeleteConsumption = () => {
    const length = newConsumptions.length;
    if (!length) return;
    const lastConsumption = newConsumptions[length - 1];

    // NOTE id 값 유무 판단하여, 로컬에 있는 행 제거 || DELETE API 요청 분기 나눈다.
    if (lastConsumption.hasOwnProperty('id')) {
      const { id } = lastConsumption;
      consumptionApi.deleteVesselConsumptionInfo(shipId, id).then((res) => {
        setNewCosumptions(
          produce(newConsumptions, (draft) => {
            draft.pop();
          })
        );
      });
    } else {
      setNewCosumptions(
        produce(newConsumptions, (draft) => {
          draft.pop();
        })
      );
    }
  };

  /* Hooks */
  useEffect(() => {
    let _vesselType;
    switch (typeAIS) {
      case 'ais':
        _vesselType = config.AIS;
        break;
      case 'noAis':
        _vesselType = config.NOT_AIS;
        break;
      case 'pilot':
        _vesselType = config.FERRY;
        break;
      default:
        _vesselType = '';
    }

    setVesselType(_vesselType);
    const [lockConfig, autoCalcConfig] = config.lockState[_vesselType] ?? [
      {},
      {},
    ];

    setLockState(lockConfig);
    setAutoCalcState(autoCalcConfig);
  }, [typeAIS]);

  /**
   * @description footer에 들어가는 Summary 테이블
   * @param {} data
   * @returns
   */
  const footerTable = () => {
    return (
      <Table
        className="footer-summary-table"
        columns={footerColumns}
        dataSource={[summary]}
        pagination={false}
        showHeader={false}
        bordered={true}
        scroll={{ y: 240 }}
      />
    );
  };

  /* RENDER */
  return (
    <>
      <div className="cm-table-container">
        <div className="cm-table-flex-box">
          <div className="header-interface-box">
            <div className="legend-box interface-area">
              <div className="legend">
                <img src={TABLE_LEGEND} />
                <span className="legend-text">자동계산값</span>
              </div>
              <div className="legend">
                <img src={TABLE_LEGEND_2} />
                <span className="legend-text">수정된 자동계산값</span>
              </div>
            </div>
            <div className="btn-box interface-area">
              {checkAvailableUIComponent(level, 1, [
                <>
                  <button
                    onClick={() => {
                      handleInsertConsumption();
                    }}
                  >
                    행 추가
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteConsumption();
                    }}
                  >
                    행 삭제
                  </button>
                </>,
              ])}
            </div>
          </div>

          <div className="content-box">
            <Table
              className="cm-table"
              id="cm-table"
              columns={columns}
              dataSource={newConsumptions}
              pagination={false}
              bordered
              scroll={{ y: 240 }}
              rowClassName={(record, index) => {
                let className = '';
                const { consumptionRate, reason } = record;

                className +=
                  consumptionRate >= ADEQUATE_VALUE ? 'not-adequated ' : '';
                className += reason && reason.length ? 'reasoned ' : '';

                return className;
              }}
              footer={footerTable}
            />
          </div>
        </div>
      </div>

      <FileUploadModal
        shipId={shipId}
        visible={fileAttachModalVisible}
        setVisible={setFileAttachModalVisible}
        files={rowFiles}
        manageId={selectedManageId}
        type={'CM'}
        uploadingHandler={(info) => {
          // NOTE
        }}
        completedHandler={(file) => {
          const { rows } = file.response;

          // NOTE redux에 파일 추가
          const tempConsumption = produce(
            newConsumptions,
            (draftConsumptions) => {
              draftConsumptions[selectedRowIndex].files = rows;
            }
          );
          setNewCosumptions(tempConsumption);
          setRowFiles(rows);
        }}
        deletedHandler={(fileId) => {
          // NOTE delete API
          consumptionApi
            .deleteFileVesselConsumptionRow(fileId)
            .then(() => {
              let newFiles = rowFiles.filter((f) => {
                return f.id !== fileId;
              });

              const tempConsumptions = produce(
                newConsumptions,
                (draftConsumptions) => {
                  draftConsumptions[selectedRowIndex].files = newFiles;
                }
              );

              setRowFiles(newFiles);
              setNewCosumptions(tempConsumptions);
              MessageAlert.success('삭제 성공');
            })
            .catch((err) => {
              console.log('err: ', err);
              MessageAlert.error('삭제 실패');
            });
        }}
        cancelHandler={() => {
          setRowFiles([]);
          setSelectedManageId(null);
          setFileAttachModalVisible(false);
        }}
      />
      <CalcConsumptionModal
        shipId={shipId}
        row={selectedRow}
        visible={calcConsumptionModalVisible}
        setVisible={setCalcConsumptionModalVisible}
      />

      <Modal
        className="warning-recalc-modal-container"
        visible={warningRecalcModalVisible}
        closeIcon={<></>}
        centered
        footer={[
          <button
            className="button cancel"
            onClick={() => {
              setWarningRecalcModalVisible(false);
            }}
          >
            아니오
          </button>,
          <button
            className="button ok"
            onClick={() => {
              setWarningRecalcModalVisible(false);
              handleRefreshOil();
            }}
          >
            예
          </button>,
        ]}
      >
        <div className="text-box">
          새로운 산출량 계산시 이전 산출량은 복원이 불가능합니다. <br />
          계속 진행하시겠습니까?
        </div>
      </Modal>
    </>
  );
};

// NOTE td 태그용 컴포넌트 만들어서, 각 필드별로 가시되는지 여부랑 autoCalc여부 uploaded 여부 멕여서 가야함
export default React.memo(ConsumptionManageTable);
