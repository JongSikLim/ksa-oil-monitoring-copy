import Modal from 'antd/lib/modal/Modal';
import React from 'react';

const FileDownloadModal = ({
  handleOk,
  visible,
  setVisible,
  handleClickExcel,
  handleClickPdf,
}) => {
  return (
    <Modal
      title={'다운로드 추출 형식 선택'}
      className="file-format-select-modal"
      onOk={handleOk}
      visible={visible}
      centered={true}
      closable={false}
      footer={[
        <button
          className="option"
          onClick={() => {
            setVisible(false);
          }}
        >
          취소
        </button>,
      ]}
    >
      <div className="button-box">
        <button
          key={'downloadExcelButton'}
          className="option"
          onClick={handleClickExcel}
        >
          EXCEL
        </button>
        <button
          key={'downloadPdfButton'}
          className="option"
          onClick={handleClickPdf}
        >
          PDF
        </button>
      </div>
    </Modal>
  );
};

FileDownloadModal.defaultProps = {
  title: null,
  className: null,
  handleOk: () => {},
  handleCancel: () => {},
  visible: null,
  setVisible: () => {},
  handleClickExcel: () => {},
  handleClickPdf: () => {},
};

export default FileDownloadModal;
