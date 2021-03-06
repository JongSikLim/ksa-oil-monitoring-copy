import React, { useEffect, useState } from 'react';
import { Input, Modal, Popover, Radio, Table, Tabs } from 'antd';

import {
  ConsumptionChart,
  ConsumptionStandard,
  EngineParticular,
  VesselParticular,
} from './components';

import './VesselParticular.css';
import './components.css';

import { ParticularAPI } from 'api';
import { useDispatch, useSelector } from 'react-redux';

import SEARCH_ICON from 'assets/svgs/icon_search.svg';

import { getObjectSize } from 'utils/esManager';
import { vesselActions } from 'redux/reducer/vessel';
import { FileUploadModal } from 'components/dataEntry';

import { checkAvailableUIComponent } from 'utils/authorizationManager';
import { FileDownloadModal } from 'components/dataDisplay';
import MessageAlert from 'utils/MessageAlert';

const { Search } = Input;

const VesselParticularPresenter = ({
  tableColumns,
  filterVesselList,
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
}) => {
  /* States */
  const dispatch = useDispatch();
  const [attachModalVisible, setAttachModalVisible] = useState(false);
  const taInfo = useSelector((state) => state.vessel.particular.ta);
  const { level } = useSelector((state) => state.session.user);
  const files = useSelector(
    (state) => state.vessel.files,
    (left, right) => {
      return left.length === right.length;
    }
  );
  const [fileDownloadModalVisible, setFileDownloadModalVisible] =
    useState(false);

  const { shipId } = selectVessel;

  /* Functions */
  const handleFileUploadCompleted = () => {
    ParticularAPI.getFileList(shipId).then((res) => {
      const { rows } = res;

      if (getObjectSize(rows) !== 0) {
        dispatch(vesselActions.setFiles(rows));
      }
    });
  };

  /* Hooks */
  useEffect(() => {
    ParticularAPI.getFileList(shipId).then((res) => {
      const { rows } = res;

      if (getObjectSize(rows) !== 0) {
        dispatch(vesselActions.setFiles(rows));
      } else {
        dispatch(vesselActions.setFiles([]));
      }
    });

    return () => {
      dispatch(vesselActions.setFiles([]));
    };
  }, [selectVessel]);

  /* Render */
  return (
    <div className="particular-container">
      <div className="particular-flex-box">
        <div className="vessel-list-area">
          <div className="vessel-search-box">
            <Search
              size="large"
              className="vessel-search-input"
              placeholder="????????? ?????? ??????????????? ????????? ?????????"
              prefix={<img src={SEARCH_ICON} />}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
          <div className="vessel-type-box">
            <Radio.Group
              className="vessel-category-tab"
              value={vesselCategory}
              onChange={(e) => {
                setVesselCategory(e.target.value);
              }}
            >
              <Radio.Button className="vessel-category" value="ALL">
                ????????????
              </Radio.Button>
              <Radio.Button className="vessel-category" value="CRUSE">
                ?????????
              </Radio.Button>
              <Radio.Button className="vessel-category" value="CARGO">
                ?????????
              </Radio.Button>
              <Radio.Button className="vessel-category" value="ETC">
                ?????????
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className="vessel-list-box">
            <Table
              id="vessel-list-table"
              scroll={{ y: 727 }}
              columns={tableColumns}
              dataSource={filterVesselList}
              pagination={false}
              onChange={handleChange}
              onRow={(record) => {
                return {
                  onClick: () => {
                    handleClickVessel(record);
                  },
                };
              }}
              rowClassName={(record) => {
                return `${
                  selectVessel.shipId === record.shipId ? 'active' : ''
                }`;
              }}
            ></Table>
          </div>
        </div>
        <div className="vessel-info-area">
          <div className="header-box">
            <div className="title-area">
              <span className="title">{selectVessel.name}</span>
            </div>
            <div className="tab-area">
              <div className="tab-list">
                <div
                  className={`tab-item ${activePanel === 'SH' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('SH');
                  }}
                >
                  ?????? ?????? (SH)
                </div>
                <div
                  className={`tab-item ${activePanel === 'EN' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('EN');
                  }}
                >
                  ?????? ?????? (EN)
                </div>
                <div
                  className={`tab-item ${activePanel === 'GR' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('GR');
                  }}
                >
                  ??????????????? ???????????? (GR)
                </div>
                <div
                  className={`tab-item ${activePanel === 'TA' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('TA');
                  }}
                >
                  ????????? ????????? (TA)
                </div>
              </div>
            </div>
          </div>
          <div className="sub-header-box">
            <div className="sub-title-area">
              <span className="sub-title">
                {activePanel === 'SH' && '?????? ??????, ?????? ??????'}
                {activePanel === 'EN' && '- ?????????, ????????????'}
                {activePanel === 'GR' && '- ??????????????? ????????????'}
                {activePanel === 'TA' &&
                  (taInfo.ship.kind_2 !== '??????'
                    ? '- ????????????????????????????????? (??????????????? ??? ??????????????????)'
                    : '- ????????????????????????????????? (?????????)')}
              </span>
            </div>
            <div className="interface-area">
              {activePanel === 'SH' &&
                checkAvailableUIComponent(level, 1, [
                  <>
                    <button className="btn" onClick={handleSHSave}>
                      ??????{''}
                    </button>
                  </>,
                  <></>,
                ])}
              {activePanel === 'EN' &&
                checkAvailableUIComponent(level, 1, [
                  <>
                    <button className="btn" onClick={handleENSave}>
                      ??????{''}
                    </button>
                  </>,
                  <></>,
                ])}
              {activePanel === 'GR' &&
                checkAvailableUIComponent(level, 1, [
                  <>
                    <button
                      className="btn"
                      onClick={() => {
                        handleGRSave();
                      }}
                    >
                      ??????
                    </button>
                  </>,
                  <></>,
                ])}
              {activePanel === 'TA' && (
                <>
                  {checkAvailableUIComponent(level, 1, [
                    <button
                      className="btn"
                      id="attachmentBtn"
                      onClick={() => {
                        setAttachModalVisible(true);
                      }}
                    >
                      ?????? ??????
                    </button>,
                  ])}
                  <button
                    className="btn"
                    id="downloadBtn"
                    onClick={() => {
                      setFileDownloadModalVisible(true);
                    }}
                  >
                    ????????????
                  </button>
                  <FileUploadModal
                    shipId={shipId}
                    visible={attachModalVisible}
                    setVisible={setAttachModalVisible}
                    files={files}
                    type={'TA'}
                    uploadingHandler={(info) => {
                      dispatch(vesselActions.uploadFile(info));
                    }}
                    completedHandler={() => {
                      handleFileUploadCompleted();
                    }}
                    deletedHandler={(fileId) => {
                      ParticularAPI.deleteFile(fileId)
                        .then((res) => {
                          let newFiles = files.filter((f) => {
                            return f.id !== fileId;
                          });

                          dispatch(vesselActions.setFiles(newFiles));
                          MessageAlert.success('????????????');
                        })
                        .catch((err) => {
                          //FIXME ?????? ?????? ??????
                          MessageAlert.error('?????? ??????');
                        });
                    }}
                  />
                  {checkAvailableUIComponent(level, 1, [
                    <button
                      className="btn"
                      id="saveBtn"
                      onClick={() => {
                        const { ferry } = taInfo;
                        const { ferryShipId } = ferry;
                        const { shipId } = selectParticular;

                        if (!ferryShipId) {
                          ParticularAPI.insertTaInfo(shipId, ferry);
                        } else {
                          ParticularAPI.updateTaInfo(
                            shipId,
                            ferryShipId,
                            ferry
                          );
                        }
                      }}
                    >
                      ??????
                    </button>,
                  ])}
                </>
              )}
            </div>
          </div>
          <div className="content-box">
            <div className="content-flex-box">
              {activePanel === 'SH' && (
                <VesselParticular
                  particularForm={particularForm}
                  selectVessel={selectVessel}
                />
              )}
              {activePanel === 'EN' && (
                <EngineParticular
                  particularForm={particularForm}
                  selectVessel={selectVessel}
                />
              )}
              {activePanel === 'GR' && (
                <ConsumptionChart selectVessel={selectVessel} />
              )}
              {activePanel === 'TA' && <ConsumptionStandard />}
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="vessel-particular-save-confirm-modal"
        title={'?????? ?????? ??????'}
        visible={confirmSHModalVisible}
        okText={'???'}
        cancelText={'?????????'}
        onOk={() => {
          particularForm.submit();
          setConfirmSHModalVisible(false);
        }}
        onCancel={() => {
          setConfirmSHModalVisible(false);
        }}
      >
        <p>????????? ???????????? ????????????. ?????????????????????????</p>
      </Modal>
      <Modal
        className="engine-particular-save-confirm-modal"
        title={'?????? ?????? ??????'}
        visible={confirmENModalVisible}
        okText={'???'}
        cancelText={'?????????'}
        onOk={() => {
          particularForm.submit();
          setConfirmENModalVisible(false);
        }}
        onCancel={() => {
          setConfirmENModalVisible(false);
        }}
      >
        <p>????????? ???????????? ????????????. ?????????????????????????</p>
      </Modal>

      <FileDownloadModal
        visible={fileDownloadModalVisible}
        setVisible={setFileDownloadModalVisible}
        handleClickExcel={() => {
          handleDownloadTaExcelReport();
        }}
        handleClickPdf={() => {
          handleDownloadTaPdfReport();
        }}
      ></FileDownloadModal>
    </div>
  );
};

export default VesselParticularPresenter;
