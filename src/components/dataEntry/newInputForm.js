import { DatePicker, Form, Input, InputNumber, Select, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import EditableTable from './EditableTable';
import TableInputForm from './TableInputForm';

/**
 * 해당 컴포넌트에서는 데이터만 다룬다.
 * @param {*} param0
 * @returns
 */
const InputForm = function ({ config, form }) {
  const {
    cKey,
    label,
    type,
    unit,
    className,
    suffix = '',
    style,
    disabled,
    rules,
  } = config; // 기본용
  const { addonBefore } = config;
  const { options, setEngine = null } = config; // 셀렉박스용
  const { columns = [], dataSource = [] } = config; // 테이블용
  const defaultValue = form.getFieldValue(cKey);

  const inputConfig = {
    disabled,
    addonBefore,
    suffix,
    style,
    size: 'large',
  };

  const selectConfig = {
    className,
    disabled,
    options,
    onChange: (e, record) => {
      // 엔진 예외처리
    },
  };

  const tableConfig = {
    className,
    type,
    columns,
  };

  const dateTimeConfig = {
    className,
    disabled,
  };

  const getEl = () => {
    let el;

    switch (type) {
      case 'string':
        el = <Input {...inputConfig} />;
        break;
      case 'number':
        el = (
          <InputNumber
            {...inputConfig}
            keyboard={false}
            formatter={(value) => {
              return `${value} ${suffix}`;
            }}
          />
        );
        break;
      case 'dropdown':
        el = <Select {...selectConfig}></Select>;
        break;
      case 'datetime':
        const momentDefaultValue = moment(defaultValue, 'YYYYMMDDHHmmss');
        el = (
          <DatePicker
            placeholder={''}
            {...dateTimeConfig}
            style={{ width: '100%', height: '48px', borderRadius: '4px' }}
            suffixIcon={false}
          />
        );
        break;
      case 'table':
        el = <TableInputForm {...tableConfig}></TableInputForm>;
      case 'mainEngineConsumption':
        el = (
          <table className="editable-table sub-consumption">
            <thead>
              <tr>
                <th>부하 (%)</th>
                <th>연료소모율 (g/kwh)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  key={`mecl${form.getFieldValue('mainEngineConsumptionLoad')}`}
                >
                  <Form.Item name={'mainEngineConsumptionLoad'}>
                    <input
                      type="number"
                      style={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                      }}
                      disabled
                    />
                  </Form.Item>
                </td>
                <td
                  key={`mecr${form.getFieldValue('mainEngineConsumptionLoad')}`}
                >
                  <Form.Item name={'mainEngineConsumptionRate'}>
                    <input
                      type="number"
                      style={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                      }}
                      disabled
                    />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>
        );
        break;
      case 'subEngineConsumption':
        el = (
          <table className="editable-table sub-consumption">
            <thead>
              <tr>
                <th>평균 부하 (%)</th>
                <th>연료소모량 (l/h)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Item name={'subEngineConsumptionLoad'}>
                    <InputNumber bordered={false} width={'100%'} />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name={'subEngineConsumption'}>
                    <InputNumber bordered={false} width={'100%'} />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>
        );
        break;
      default:
        el = <></>;
        break;
    }

    return el;
  };

  return (
    <Form.Item name={cKey} className={className} rules={rules}>
      {getEl()}
    </Form.Item>
  );
};

export default InputForm;
