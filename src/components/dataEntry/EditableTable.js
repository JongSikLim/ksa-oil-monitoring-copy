import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, InputNumber } from 'antd';

const EditableContext = React.createContext(null);

/**
 * @title EditableRow 컴포넌트
 * @description 값이 수정가능한 테이블의 row 컴포넌트
 */
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

/**
 * @title EditableCell 컴포넌트
 * @description 값이 수정가능한 테이블의 Cell 컴포넌트
 */
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  type,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        style={{
          margin: 0,
        }}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

/**
 * @title EditableTable 컴포넌트
 * @description 값이 수정가능한 테이블 컴포넌트
 */
const EditableTable = ({ columns, dataSource, onChange }) => {
  console.log('columns: ', columns);
  console.log('dataSource: ', dataSource);
  /* States */
  const [_dataSource, setDataSource] = useState(null);

  /* Functions */
  /**
   * @title
   * @description
   */
  const handleSave = (row) => {
    const newData = [..._dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    onChange(newData);
  };

  /* Variables */
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const _columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        handleSave: handleSave,
      }),
    };
  });

  /* Hooks */
  useEffect(() => {
    setDataSource(dataSource);
  }, [dataSource]);

  return (
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={_dataSource}
      columns={_columns}
      pagination={false}
    />
  );
};

export default EditableTable;
