import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const DragNDrop = () => {
  const dndConfig = {
    name: 'file',
    multiple: true,
    action: 'storageUrl',
    onChange: (info) => {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Dragger {...dndConfig}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        파일을 업로드 하기 위해서는 클릭하거나 파일을 드래그하세요.
      </p>
    </Dragger>
  );
};

export default DragNDrop;
