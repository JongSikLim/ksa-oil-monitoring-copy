import { Table } from 'antd';
import React from 'react';
import { EditableTable } from '.';

const TableInputForm = ({ type, columns, className, value, onChange }) => {
  let tableConfig = {
    className,
    columns,
    dataSource: value,
    onChange,
  };

  // FIXME subConsumption 데이터 보정
  if (!Array.isArray(tableConfig.dataSource)) {
    tableConfig.dataSource = [tableConfig.dataSource];
  }

  const getEl = () => {
    let el;

    if (type === 'table') {
      el = <Table {...tableConfig} pagination={false} bordered={true}></Table>;
    } else if (type === 'editableTable') {
      el = <EditableTable {...tableConfig}></EditableTable>; // 안씀
    }

    return el;
  };

  return <>{getEl()}</>;
};

export default TableInputForm;
