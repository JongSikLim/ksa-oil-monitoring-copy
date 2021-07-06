import React, { useEffect, useState } from 'react';

// Data custom css
import './DataMonitoring.css';

// Icons
import SearchIcon from 'assets/svgs/icon_search.svg';

// Antd
import { Table, Input, Select, Spin, Skeleton, Popover, Button, List } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Search } = Input;
const { Option } = Select;

const DataMonitoringPresenter = (props) => {
    const {
        filteredList,
        searchValue,
        setSearchValue,
        searchOption,
        setSearchOption,
        onLoading
    } = props;
    
    /* STATE */
    
     // popover content
    const handlePopoverContent = (data) => {
        const { aisEmptyDay } = data;
        
        if (aisEmptyDay !== null) {
            const content = (
                <List
                    size="small"
                    dataSource={aisEmptyDay}
                    renderItem={(item) => <List.Item><span className="list-item-bullet"></span><span>{item}</span></List.Item>}
                />
            );
            
            const className = aisEmptyDay.length < 5 ? "row-popover-content" : "row-popover-content scroll";
            const popover = (
                <Popover mask
                    overlayClassName={className}
                    placement="rightTop"
                    title={<span>AIS 미수신 날짜</span>}
                    content={content}
                    trigger="click"
                >
                    <Button className="row-popover-btn">{data.message}</Button>
                </Popover>
            );
            
            return popover;
        } else {
            return data.message;
        }
    };
    
    // 테이블 컬럼
    const dataTableColumn = [
        {
            title: '선사',
            dataIndex: 'companyName',
            width: '230px'
        },
        {
            title: '선명',
            dataIndex: 'shipName',
            width: '250px',
            className: 'text-bold'
        },
        {
            title: 'MMSI',
            dataIndex: 'mmsi',
            width: '170px'
        },
        {
            title: '오류코드',
            dataIndex: ['error', 'error.codeStr'],
            width: '170px',
            render: (text, record) => <span data={record.error.code}>{record.error.codeStr}</span>
        },
        {
            title: '상세사항',
            dataIndex: 'message',
            width: 'auto',
            render: (text, record) => handlePopoverContent(record),
            sorter: (a, b) => {
                a = a.message;
                b = b.message;
                
                return handleStringSort(a, b);
            }
        },
        {
            title: 'AIS 최신 날짜',
            dataIndex: 'lastAisReceiverTime',
            width: '240px',
            sorter: (a, b) => {
                a = a.lastAisReceiverTime;
                b = b.lastAisReceiverTime;
                
                return handleStringSort(a, b);
            }
        }
    ];
    
    /* FUNCTIONS */
    // 검색 조건
    const handleOptionChange = (key) => {
        setSearchOption(key);
    };
    
    // 문자열 정렬
    const handleStringSort = (a, b) => {        
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }
    }
  
    return (
        <div className="data-container">
            <div className="data-header-wrapper">
                <h4 className="data-header-title">데이터 관리</h4>
                
                <div className="data-search">
                    <Select
                        className="search-select"
                        placeholder="오류코드"
                        value={searchOption}
                        onChange={handleOptionChange}
                        dropdownClassName="search-select-dropdown"
                    >
                        <Option key="ALL">전체</Option>
                        <Option key="info">선박제원</Option>
                        <Option key="ais">AIS</Option>
                        <Option key="mmsi">MMSI</Option>
                    </Select>
                    <Search
                        className="search-input"
                        placeholder="선박명을 입력해 주세요."
                        prefix={<img src={SearchIcon} />}
                        enterButton={false}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                    />
                </div>
            </div>
            
            <div className="data-content-wrapper">
                <Table
                    className="data-table"
                    columns={dataTableColumn}
                    rowKey={(record) => record.id }
                    dataSource={onLoading ? [] : filteredList}
                    pagination={false}
                    scroll={{ x: true, y: '100%' }}
                    locale={{emptyText: onLoading ? <Skeleton active={true} paragraph={{ rows: 3 }} /> : null}}
                />
            </div>
        </div>
    );
};

export default DataMonitoringPresenter;