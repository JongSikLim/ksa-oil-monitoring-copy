import React from 'react';
import { Select } from 'antd';
import 'antd/lib/select/style/css';

/**
 * 기본 검색 옵션
 * 검색조건
 * - 라벨 텍스트 기준
 * @param {*} input
 * @param {*} option
 */
const defaultFilterOption = (input, option) => {
  return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};

/**
 *
 * @param {*} optionList [{label:보여질이름, value: 값}, ...]
 */
const SearchBox = ({
  optionList,
  onChangeHandler = null,
  onSearchHandler = null,
  onFocusHandler = null,
  onBlurHandler = null,
  filterOption = defaultFilterOption,
  value = null,
  style = null,
  prefix = null,
  suffix = null,
  showArrow = false,
  dropdownRender,
}) => {
  return (
    <Select
      open={true}
      dropdownMatchSelectWidth={false}
      placeholder="선박명 또는 선박번호를 입력해 주세요."
      id="customSearchBox"
      showSearch
      value={value}
      options={optionList}
      onChange={onChangeHandler}
      onSearch={onSearchHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      filterOption={filterOption}
      style={{
        width: '100%',
        ...style,
      }}
      prefix={prefix}
      suffix={suffix}
      showArrow={showArrow}
      dropdownRender={dropdownRender}
      getPopupContainer={() => document.getElementById('mainContent')}
      dropdownClassName={'header-vessel-selector-dropdown-box'}
    ></Select>
  );
};

export default SearchBox;
