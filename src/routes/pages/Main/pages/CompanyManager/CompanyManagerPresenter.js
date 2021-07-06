import { Table, Modal, Input } from 'antd';
import { SearchBox } from 'components/dataEntry';
import React, { useState } from 'react';
import actionCreator from 'redux/reducer/actionCreator';
import './CompanyManager.css';
import SEARCH_ICON from 'assets/svgs/icon_search.svg';
import { checkAvailableUIComponent } from 'utils/authorizationManager';
import { useSelector } from 'react-redux';
import { downloadFromUrl } from 'utils/esManager';
import { API_SERVER_URL } from 'utils';
import URL from 'api/apiContstant';

const { vesselActions } = actionCreator;
const { Search } = Input;

const downloadManageVesselDocumentUrl = `${API_SERVER_URL}${URL.EXPORT_MANAGE_VESSEL}`;

const CompanyManagerPresenter = ({
  companySearchBoxOptions,
  companyTableColumn,
  companyTableDataSource,
  vesselListTableColumn,
  vesselTableDataSource,
  handleClickCompany,
  selectCompany,
  companySearchValue,
  setCompanySearchValue,
  filterCompaniesOnRegist,
  setFilterCompaniesOnRegist,
  selectedCompanyOnRegist,
  setSelectedCompanyOnRegist,
  vesselSearchValue,
  setVesselSearchValue,
  filterVesselsOnRegist,
  setFilterVesselsOnRegist,
  selectedVesselOnRegist,
  setSelectedVesselOnRegist,
  aknowledgeManageOtherCompany,
  setAknowledgeManageOtherCompany,
  handleInsertCompany,
  handleInsertVessel,
  businessCompanySearchValue,
  setbusinessCompanySearchValue,
  filterBusinessCompanies,
  handleDoubleClickVessel,
}) => {
  const [insertCompanyVisible, setInsertCompanyVisible] = useState(false);
  const [insertVesselVisible, setInsertVesselVisible] = useState(false);
  const { level } = useSelector((state) => state.session.user);

  const { chief, companyNumber, corporateNumber, address } = selectCompany;

  return (
    <>
      <div className="cmanager-container">
        <div className="cmanger-flex-box">
          <div className="left-side page">
            <div className="header-area">
              <div className="title-area">선사 관리</div>
              <div className="insert-company-btn-area">
                {/* 선사 등록 부분 계정 권한 level 1 이상 */}
                {checkAvailableUIComponent(level, 1, [
                  <button
                    className="insert-company-btn"
                    onClick={() => {
                      setInsertCompanyVisible(true);
                    }}
                  >
                    선사 등록
                  </button>,
                  <></>,
                ])}
              </div>
            </div>
            <div className="content-area">
              <div className="header-interface-area">
                {/* <div className="title-area">선사 리스트</div> */}

                <div className="search-box-area">
                  <Search
                    className="company-search-input-box"
                    placeholder="선사명 또는 거래처 코드를 입력해 주세요."
                    value={businessCompanySearchValue}
                    onChange={(e) => {
                      setbusinessCompanySearchValue(e.target.value);
                    }}
                    prefix={<img src={SEARCH_ICON} />}
                    enterButton={false}
                  />
                </div>

                <div className="button-area">
                  <button
                    className="btn export-btn"
                    onClick={() => {
                      downloadFromUrl(downloadManageVesselDocumentUrl);
                    }}
                  >
                    관리선박현황
                  </button>
                </div>
              </div>
              <div className="company-list-table-area">
                <Table
                  bordered
                  columns={companyTableColumn}
                  dataSource={filterBusinessCompanies}
                  pagination={false}
                  scroll={{ x: true, y: '100%' }}
                  onRow={(record, index) => {
                    return {
                      onClick: () => {
                        handleClickCompany(
                          record.companyId,
                          record.companyName,
                          record.ships,
                          record.companyCode
                        );
                      },
                    };
                  }}
                ></Table>
              </div>
            </div>
          </div>
          <div className="right-side page">
            <div className="header-area">
              <div className="first-line">
                <div className="title-area">{selectCompany.name}</div>
                <div className="insert-vessel-btn-area">
                  {checkAvailableUIComponent(level, 1, [
                    <button
                      className="insert-vessel-btn"
                      onClick={() => {
                        setInsertVesselVisible(true);
                      }}
                    >
                      선박 등록
                    </button>,
                    <></>,
                  ])}
                </div>
              </div>
              <div className="second-line">
                <div className="company-info-panel">
                  <div className="sector">
                    <div className="title">대표자</div>
                    <div className="content">{chief}</div>
                  </div>
                  <div className="sector">
                    <div className="title">사업자등록번호</div>
                    <div className="content">{companyNumber}</div>
                  </div>
                  <div className="sector">
                    <div className="title">법인등록번호</div>
                    <div className="content">{corporateNumber}</div>
                  </div>
                  <div className="sector">
                    <div className="title">주소</div>
                    <div className="content">{address}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="hr-line" />
            <div className="vessel-list-area">
              <div className="title-area">
                선박 리스트 ({vesselTableDataSource.length})
              </div>
              <div className="vessel-list-table-area">
                <Table
                  bordered
                  columns={vesselListTableColumn}
                  dataSource={vesselTableDataSource}
                  pagination={false}
                  scroll={{ x: true, y: '100%' }}
                  onRow={(record, index) => {
                    const { id } = record;
                    return {
                      onDoubleClick: () => {
                        console.log('event 호출');
                        handleDoubleClickVessel(id);
                      },
                    };
                  }}
                ></Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="regist-company-modal"
        title="선사 등록"
        centered
        visible={insertCompanyVisible}
        width={'610px'}
        onOk={() => {
          handleInsertCompany();
          setSelectedCompanyOnRegist(null);
          setCompanySearchValue('');
          setInsertCompanyVisible(false);
        }}
        onCancel={() => {
          setSelectedCompanyOnRegist(null);
          setCompanySearchValue('');
          setInsertCompanyVisible(false);
        }}
        closeIcon={<></>}
        okText={'등록'}
        okButtonProps={{
          className: 'company-insert-ok-btn company-insert-btn',
          disabled: selectedCompanyOnRegist === null,
        }}
        cancelButtonProps={{
          className: 'company-insert-cancel-btn company-insert-btn',
        }}
      >
        <div className="modal-box company-insert-modal">
          <div className="input-box">
            <Search
              className="company-search-box"
              placeholder="선사명 또는 거래처 코드를 입력해 주세요."
              value={companySearchValue}
              onChange={(e) => {
                setCompanySearchValue(e.target.value);
              }}
              prefix={<img src={SEARCH_ICON} />}
              enterButton={false}
            />
          </div>
          <div className="company-list-box">
            {selectedCompanyOnRegist === null ? (
              <div className="company-list">
                {filterCompaniesOnRegist.map((c) => {
                  return (
                    <div
                      className="company-item"
                      onClick={() => {
                        setSelectedCompanyOnRegist(c);
                      }}
                    >
                      {c.name}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="company-info-box">
                <div className="name-box">{selectedCompanyOnRegist.name}</div>
                <div className="particular-box">
                  <div className="row">
                    <div className="option">
                      <div className="header">대표자</div>
                      <div className="content">
                        {selectedCompanyOnRegist.chief}
                      </div>
                    </div>
                    <div className="option">
                      <div className="header">사업자등록번호</div>
                      <div className="content">
                        {selectedCompanyOnRegist.companyNumber}
                      </div>
                    </div>
                    <div className="option">
                      <div className="header">법인등록번호</div>
                      <div className="content">
                        {selectedCompanyOnRegist.corporateNumber}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="option">
                      <div className="header">주소</div>
                      <div className="content">
                        {selectedCompanyOnRegist.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        className="regist-vessel-modal"
        title="선박 등록"
        width={'610px'}
        centered
        visible={insertVesselVisible}
        closeIcon={<></>}
        onOk={() => {
          if (selectedVesselOnRegist.managed && !aknowledgeManageOtherCompany) {
            setAknowledgeManageOtherCompany(true);
          } else {
            handleInsertVessel();
            setSelectedVesselOnRegist(null);
            setVesselSearchValue('');
            setInsertVesselVisible(false);
          }
        }}
        onCancel={() => {
          setSelectedVesselOnRegist(null);
          setVesselSearchValue('');
          setInsertVesselVisible(false);
        }}
        okButtonProps={{
          className: 'vessel-insert-ok-btn vessel-insert-btn',
          disabled: selectedVesselOnRegist === null,
        }}
        cancelButtonProps={{
          className: 'vessel-insert-cancel-btn vessel-insert-btn',
        }}
      >
        <div className="modal-box">
          <div className="input-box">
            <Search
              placeholder="선박명 또는 선박번호를 입력해 주세요"
              value={vesselSearchValue}
              prefix={<img src={SEARCH_ICON} />}
              onChange={(e) => {
                setVesselSearchValue(e.target.value);
              }}
              allowClear
            />
          </div>
          <div className="company-list-box list-box">
            {selectedVesselOnRegist === null ? (
              <div className="company-list list">
                {filterVesselsOnRegist.map((c) => {
                  return (
                    <div
                      className="company-item item"
                      onClick={() => {
                        setSelectedVesselOnRegist(c);
                      }}
                    >
                      {c.name}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="company-info-box info-box">
                {/* //FIXME 조건 변경 */}
                {selectedVesselOnRegist.managed &&
                aknowledgeManageOtherCompany ? (
                  <div className="other-company-manage-box">
                    <div className="name-box">
                      {selectedVesselOnRegist.name}
                    </div>
                    <div className="description">
                      해당 선박은 타 선사에 등록되어 있는 선박입니다. <br />
                      계속 진행하시겠습니까?
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="name-box">
                      {selectedVesselOnRegist.name}
                    </div>
                    <div className="particular-box">
                      <div className="row">
                        <div className="option">
                          <div className="header">선박 번호</div>
                          <div className="content">
                            {selectedVesselOnRegist.code}
                          </div>
                        </div>
                        <div className="option">
                          <div className="header">관리 번호</div>
                          <div className="content">
                            {selectedVesselOnRegist.manageCode}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CompanyManagerPresenter;
