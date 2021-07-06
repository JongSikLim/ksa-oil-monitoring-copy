import Dragger from 'antd/lib/upload/Dragger';
import React, { useEffect, useState } from 'react';
import ATTACH_IMAGE from 'assets/images/img_file-attach.png';
import URL from 'api/apiContstant';
import { API_SERVER_URL, getCookie } from 'utils';
import { initialHeaders } from 'utils/ApiManager';
import { message } from 'antd';

const FileUpload = ({
  type,
  files,
  shipId,
  manageId,
  uploadingHandler,
  completedHandler,
  failedHander = () => {},
}) => {
  const token = getCookie('KSA_ACCESS_TOKEN');
  const [actionUrl, setActionUrl] = useState('');
  const config = {
    name: 'files',
    multiple: true,
    onChange(info) {
      console.log('info: ', info);
      const { status } = info.file;

      if (status === 'uploading') {
        uploadingHandler(info);
      }
      if (status === 'done') {
        const {
          response: { result },
        } = info.file;

        completedHandler(info.file);
        message.success('파일 업로드 성공!');
      } else if (status === 'error') {
        const { error } = info.file.response;
        failedHander(error);
        message.error('파일 업로드 실패');
      }
    },
  };

  useEffect(() => {
    let acitonURL;
    if (type === 'TA') {
      acitonURL = URL.UPLOAD_FILE.replace(':shipId', shipId);
    } else if (type === 'CM') {
      acitonURL = URL.UPLOAD_ROW_ATTACHMENT_FILE.replace(
        ':shipId',
        shipId
      ).replace(':manageId', manageId);
    }
    acitonURL = `${API_SERVER_URL}${acitonURL}`;
    setActionUrl(acitonURL);

    return () => {
      setActionUrl('');
    };
  }, [shipId, manageId]);

  return (
    <Dragger
      {...config}
      action={actionUrl}
      itemRender={(node, file, fileList) => {
        return <></>;
      }}
      headers={{
        Authorization: `${token}`,
      }}
    >
      <p className="ant-upload-drag-icon">
        <img src={ATTACH_IMAGE} />
      </p>
      <p className="ant-upload-text">
        이곳을 더블클릭 또는 파일을 드래그 하세요.
      </p>
      <div className="btn-box">
        <button type="primary">파일 첨부</button>
      </div>
    </Dragger>
  );
};

export default FileUpload;
