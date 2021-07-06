import React, { useEffect, useState } from 'react';

// API
import { DataMonitoringAPI } from 'api';

import DataMonitoringPresenter from './DataMonitoringPresenter';

const DataMonitoringContainer = () => {    
    /* STATE */
    // 데이터 리스트
    const [dataList, setDataList] = useState([]);
    // 검색 조건에 따라 필터링된 리스트
    const [filteredList, setFilteredList] = useState([]);
    // 검색 조건
    const [searchOption, setSearchOption] = useState();
    // 검색값
    const [searchValue, setSearchValue] = useState('');
    // Loading Spinner 상태
    const [loading, setLoading] = useState(true);    
    
    /* FUNCTIONs */
    const getDataList = async () => {
        let response = await DataMonitoringAPI._getDataList();
        
        return response;
    };
    
    /* HOOK */
    // 데이터 리스트
    useEffect(async () => {
        let response = await getDataList();
        const { status, data } = response;
        
        if (status) {
            // 빈값 처리, 오류코드 국문 처리
            const updData = data.map((d, idx) => {
                let error = {};
                
                if (d.code === 'info') {
                    error = {
                        code: d.code,
                        codeStr: '선박제원'
                    }
                } else if (d.code === 'ais') {
                    error = {
                        code: d.code,
                        codeStr: 'AIS'
                    }
                } else if (d.code === 'mmsi') {
                    error = {
                        code: d.code,
                        codeStr: 'MMSI'
                    }
                }
                
                return {
                    ...d,
                    shipName: d.shipName.trim(),
                    mmsi: d.mmsi === '' || d.mmsi === null ? '-' : d.mmsi,
                    error
                }
            });
            
            setDataList(updData);
        } else {
            setDataList([]);
        }
        
        setLoading(false);
    }, []);
    
    // 리스트 초기화, 선박명 검색
    useEffect(() => {
        // code: info(선박제원), ais(AIS), mmsi(MMSI)
        const filteredData = dataList.filter((data) => {
            if (searchOption !== 'ALL' && searchOption !== undefined && searchValue === '') {
                return data.error.code === searchOption;
            } else if (searchOption !== 'ALL' && searchOption !== undefined && searchValue !== '') {
                return data.shipName.includes(searchValue) && data.error.code === searchOption;
            } else if (searchOption === 'ALL' || searchOption === undefined) {
                return data.shipName.includes(searchValue);
            }
        });

        setFilteredList(filteredData);
        
        return () => {
            setFilteredList([]);
        };
    }, [searchValue, searchOption, dataList]);
    
    return (
        <DataMonitoringPresenter
            filteredList={filteredList}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            onLoading={loading}
        />
    );
}

export default DataMonitoringContainer;