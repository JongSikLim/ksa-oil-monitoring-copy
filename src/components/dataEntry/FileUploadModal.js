import React from 'react';
import FileUpload from './FileUpload';
import { List, Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import DOWNLOAD_ICON from 'assets/images/btn_file-down.png';
import DELETE_ICON from 'assets/images/btn_file-delete.png';
import { API_SERVER_URL, getCookie } from 'utils';

const getfileSize = (x) => {
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(x) / Math.log(1024));
  return (x / Math.pow(1024, e)).toFixed(2) + ' ' + s[e];
};

const FileUploadModal = ({
  visible,
  setVisible,
  shipId,
  manageId,
  type,
  files,
  uploadingHandler,
  completedHandler,
  deletedHandler,
  failedHander,
  cancelHandler = () => {
    setVisible(false);
  },
}) => {
  const token = getCookie('KSA_ACCESS_TOKEN');
  return (
    <Modal
      width={860}
      bodyStyle={{
        padding: 0,
      }}
      visible={visible}
      closable={false}
      okText={null}
      footer={null}
      centered={true}
      maskClosable={true}
      onCancel={cancelHandler}
    >
      <div className="file-list-upload-modal-contaier">
        <div className="file-list-upload-modal-flex-box">
          <div className="panel left">
            <div className="panel-flex-box">
              <FileUpload
                type={type}
                shipId={shipId}
                files={files}
                manageId={manageId}
                uploadingHandler={uploadingHandler}
                completedHandler={completedHandler}
                failedHander={failedHander}
              />
            </div>
          </div>
          <div className="panel right">
            <div className="panel-flex-box">
              <div className="list-group">
                <List
                  dataSource={files}
                  renderItem={(item, i) => {
                    const { link } = item;
                    const fileDownloadURL = `${API_SERVER_URL}/${link}?token=${token}`;
                    return (
                      <div className="list">
                        <div className="list-content-box">
                          <div className="icon">
                            <CheckCircleOutlined />
                          </div>
                          <div className="text">
                            <div className="head">{item.name}</div>
                            <div className="sub">
                              {`${getfileSize(item.size)} / ${getfileSize(
                                item.size
                              )}`}
                            </div>
                          </div>
                        </div>
                        <div className="list-content-box">
                          <div className="interface">
                            <span className="icon">
                              <a href={fileDownloadURL} download>
                                <img src={DOWNLOAD_ICON} />
                              </a>
                            </span>
                            <span
                              className="icon"
                              onClick={() => {
                                deletedHandler(item.id);
                              }}
                            >
                              <img src={DELETE_ICON} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                ></List>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadModal;
