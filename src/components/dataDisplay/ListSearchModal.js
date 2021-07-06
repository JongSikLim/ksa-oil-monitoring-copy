import { Modal, Input } from 'antd';
import React from 'react';
import SEARCH_ICON from 'assets/svgs/icon_search.svg';

const { Search } = Input;

const ListSearchModal = ({
  title = 'MODAL TITLE',
  className = '',
  handleOk = () => {},
  handleCancel = () => {},
  visibleState = false,
  setVisibleState = () => {},
  placeholder = '',
  searchText = '',
  handleChangeSearchText = () => {},
  filterDataList = [],
  handleClickData = () => {},
  labelDataKey = 'name',
  footer = true,
}) => {
  return (
    <Modal
      title={title}
      className={`list-search-modal ${className}`}
      visible={visibleState}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={footer}
    >
      <div className="modal-box">
        <div className="input-box">
          <Search
            placeholder={placeholder}
            value={searchText}
            prefix={<img src={SEARCH_ICON} />}
            onChange={(e) => {
              handleChangeSearchText(e.target.value);
            }}
          />
        </div>
        <div className="company-list-box">
          <div className="company-list">
            {filterDataList.map((c, i) => {
              return (
                <div
                  key={i}
                  className="company-item"
                  onClick={() => {
                    handleClickData(c);
                  }}
                >
                  {c[labelDataKey]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ListSearchModal;
