import { Tabs, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { ListSearchModal } from 'components/dataDisplay';
import actionCreator, {
  selectCompanyFacadeAction,
} from 'redux/reducer/actionCreator';
import LOGO_SVG from 'assets/svgs/logo.svg';
import COMPANY_SELECT_ICON from 'assets/svgs/icon_check-shipping-company.svg';
import SEARCH_ICON from 'assets/svgs/icon_header_search.svg';
import { checkAvailableUIComponent } from 'utils/authorizationManager';

const { TabPane } = Tabs;
const { vesselActions, fleetActions } = actionCreator;
const { Search } = Input;

const headerMatching = {
  '/m/particular': 'PARTICULAR',
  '/m/fleetMonitoring': 'FLEET',
  '/m/companyManager': 'CM',
  '/m/consumptionMonitoring': 'CONSUMPTION',
  '/m/dataMonitoring': 'DATA',
};

const Header = () => {
  /* Redux State */

  const { level } = useSelector((state) => state.session.user);
  const companies = useSelector((state) => state.company.companies); // 비즈니스 선사 리스트
  const selectCompany = useSelector((state) => state.company.selectCompany); // 선택된 선사
  const particulars = useSelector((state) => state.vessel.particulars);

  // 선대 모니터링 선박 리스트
  const shipList = useSelector((state) => state.fleet.shipList);
  // 선대 모니터링 선택 선박

  /* State */
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState('PARTICULAR');
  const [companySelectModalVisible, setCompanySelectModalVisible] =
    useState(false); // 모달 표시 상태
  const [companySearchText, setCompanySearchText] = useState(''); // 모달의 선사 입력 값
  const [filterCompanyList, setFilterCompanyList] = useState([]); // 입력 값 기준 필터링된 선사 목록
  const [filteredVesselList, setFilteredVesselList] = useState([]); // 입력 값 기준 필터링된 선사 목록
  const [filteredShipList, setFilteredShipList] = useState([]); // 입력 값 기준 필터링된 선박 목록 - 선대 모니터링

  const [vesselSearchDrawerVisible, setVesselSearchDrawerVisible] =
    useState(false);

  /* Router */
  let history = useHistory();
  let location = useLocation();

  const { pathname } = location;

  /* Functions */

  /**
   * @title 선박 클릭 처리
   */
  const handleVesselClick = useCallback((vessel) => {
    const { shipId } = vessel;

    setVesselSearchDrawerVisible(false);
    dispatch(vesselActions.setVessel(shipId));
    dispatch(vesselActions.setParticular(shipId));
  }, []);

  /**
   * @title 선대 모니터링 선박 클릭 처리
   * @description 선대 모니터링 페이지에서 헤더 선박 선택 시 선택한 선박 위치로 맵 중앙 이동, 정보 패널 출력
   * @param ship 선박 정보
   */
  const handleShipClick = useCallback((ship) => {
    const { id } = ship;

    setVesselSearchDrawerVisible(false);
    dispatch(fleetActions.setShip(id));
  }, []);

  /**
   * @title 선대 모니터링 페이지에서 선박 리스트 탭 클릭 처리
   * @description 선대 모니터링 페이지에서 선박 리스트 탭 클릭 시 해당 종류 선박을 맵에 출력
   * @param kind 선종
   */
  const handleClickFleetTab = (kind) => {
    dispatch(fleetActions.setListType(kind));
  };

  /* Hooks */
  useEffect(() => {
    setActiveMenu(headerMatching[pathname]);

    if (!['/m/fleetMonitoring'].includes(pathname)) {
      dispatch(fleetActions.setListType(null));
    }
  }, [location]);

  useEffect(() => {
    console.log('companies: ', companies);
    const filterList = companies.filter((c) => {
      const { name, companyCode } = c;

      return (
        name.includes(companySearchText) ||
        companyCode.includes(companySearchText)
      );
    });

    setFilterCompanyList(filterList);

    return () => {
      setFilterCompanyList([]);
    };
  }, [companies, companySearchText]);

  useEffect(() => {
    setFilteredVesselList(particulars);
  }, [particulars]);

  useEffect(() => {
    setFilteredShipList(shipList);
  }, [shipList]);

  useEffect(() => {
    const clickListener = () => {
      setVesselSearchDrawerVisible(false);
    };
    document.body.addEventListener('click', clickListener);

    return () => {
      document.body.removeEventListener('click', clickListener);
    };
  }, []);

  return (
    <>
      <div className="header-container" key={'headerContainer'}>
        <div className="left-menu">
          <div className="logo-box">
            <img src={LOGO_SVG} />
          </div>
          <div className="nav-box">
            <nav className="menu-nav">
              <ul className="menu-ul">
                <li
                  className={`menu-item ${activeMenu === 'CM' ? 'active' : ''}`}
                  onClick={() => {
                    history.push('/m/companyManager');
                  }}
                >
                  선사 관리
                </li>
                <li
                  className={`menu-item ${
                    activeMenu === 'PARTICULAR' ? 'active' : ''
                  }`}
                  onClick={() => {
                    history.push('/m/particular');
                  }}
                >
                  선박 제원 정보
                </li>
                <li
                  className={`menu-item ${
                    activeMenu === 'CONSUMPTION' ? 'active' : ''
                  }`}
                  onClick={() => {
                    history.push('/m/consumptionMonitoring');
                  }}
                >
                  선박 연료유 관리
                </li>
                <li
                  className={`menu-item ${
                    activeMenu === 'FLEET' ? 'active' : ''
                  }`}
                  onClick={() => {
                    history.push('/m/fleetMonitoring');
                  }}
                >
                  선박 모니터링
                </li>
                {checkAvailableUIComponent(level, 1, [
                  <li
                    className={`menu-item ${
                      activeMenu === 'DATA' ? 'active' : ''
                    }`}
                    onClick={() => {
                      history.push('/m/dataMonitoring');
                    }}
                  >
                    데이터 관리
                  </li>,
                ])}
              </ul>
            </nav>
          </div>
        </div>
        <div className="right-menu">
          <div className="interface-box">
            {/* 선사 선택 토글 바 */}
            <div
              className="company-select-box"
              onClick={() => {
                setCompanySelectModalVisible(true);
              }}
              style={{
                visibility: ![
                  '/m/fleetMonitoring',
                  '/m/companyManager',
                  '/m/companyManager',
                  '/m/dataMonitoring',
                ].includes(pathname)
                  ? 'visible'
                  : 'hidden',
              }}
            >
              {/* <CheckCircleFilled className="icon" /> */}
              <img src={COMPANY_SELECT_ICON} />

              <div className="text">{selectCompany.name}</div>
            </div>

            {/* 선박 검색 창 */}
            <div
              className="vessel-search-box"
              style={{
                display: [
                  '/m/fleetMonitoring',
                  '/m/consumptionMonitoring',
                ].includes(pathname)
                  ? 'flex'
                  : 'none',
              }}
            >
              {/* 선박 검색 바 */}
              {['/m/consumptionMonitoring'].includes(pathname) && (
                <Search
                  size="large"
                  className="header-vessel-search-input"
                  placeholder="선박명 또는 선박번호를 입력해 주세요."
                  prefix={<img src={SEARCH_ICON} />}
                  onFocus={(e) => {
                    setVesselSearchDrawerVisible(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const text = e.target.value;
                    const filteredVessels = particulars.filter((v) => {
                      const { name, manageCode } = v;

                      return name.includes(text) || manageCode.includes(text);
                    });

                    setFilteredVesselList(filteredVessels);
                  }}
                />
              )}

              {/* 선박 검색 바 - 선대 모니터링, 데이터 관리 */}
              {['/m/fleetMonitoring'].includes(pathname) && (
                <Search
                  size="large"
                  className="header-vessel-search-input"
                  placeholder="선박명 또는 선박번호를 입력해 주세요."
                  prefix={<img src={SEARCH_ICON} />}
                  onFocus={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setVesselSearchDrawerVisible(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const text = e.target.value;
                    const filteredShip = shipList.filter((v) => {
                      // const { name, mmsi } = v;
                      const { name } = v;

                      // return name.includes(text) || mmsi.includes(text);
                      return name.includes(text);
                    });

                    setFilteredShipList(filteredShip);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <ListSearchModal
        title="선사 선택"
        className="header-select-company-modal"
        visibleState={companySelectModalVisible}
        setVisibleState={setCompanySelectModalVisible}
        placeholder="선사명 또는 거래처 코드를 입력하세요."
        searchText={companySearchText}
        handleChangeSearchText={setCompanySearchText}
        filterDataList={filterCompanyList}
        handleClickData={(c) => {
          // NOTE 선박 연료유 관리 페이지를 위해서, PARTICULARS SET 필요함
          const { companyId } = c;

          setCompanySelectModalVisible(false);
          setCompanySearchText('');
          selectCompanyFacadeAction(dispatch, c);
        }}
        handleCancel={() => {
          setCompanySelectModalVisible(false);
          setCompanySearchText('');
        }}
        footer={false}
        key={'listSearchModal'}
      />

      <div
        key={'drawerContainer'}
        className="vessel-search-drawer-container"
        style={{
          display: vesselSearchDrawerVisible ? 'block' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex-box">
          {!['/m/fleetMonitoring'].includes(pathname) && (
            <Tabs>
              <TabPane tab="전체" key="ALL">
                {filteredVesselList.map((v) => {
                  return (
                    <div
                      className="vessel-box"
                      onClick={() => {
                        handleVesselClick(v);
                      }}
                    >
                      {v.name}
                    </div>
                  );
                })}
              </TabPane>
              <TabPane tab="AIS 설치" key="AIS">
                {filteredVesselList
                  .filter((v) => {
                    const { typeAIS } = v;
                    return typeAIS === 'ais';
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleVesselClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
              <TabPane tab="AIS 미설치" key="NOT_AIS">
                {filteredVesselList
                  .filter((v) => {
                    const { typeAIS } = v;
                    return typeAIS === 'noAis';
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleVesselClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
              <TabPane tab="도선" key="FERRY">
                {filteredVesselList
                  .filter((v) => {
                    const { typeAIS } = v;
                    return typeAIS === 'pilot';
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleVesselClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
            </Tabs>
          )}

          {/* 선대 모니터링 */}
          {['/m/fleetMonitoring'].includes(pathname) && (
            <Tabs onChange={(activeKey) => handleClickFleetTab(activeKey)}>
              <TabPane tab="전체" key="all">
                {filteredShipList.map((v) => {
                  return (
                    <div
                      className="vessel-box"
                      onClick={() => {
                        handleShipClick(v);
                      }}
                    >
                      {v.name}
                    </div>
                  );
                })}
              </TabPane>
              <TabPane tab="여객선" key="ferry">
                {filteredShipList
                  .filter((v) => {
                    const { kind } = v;

                    return kind === '여객선';
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleShipClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
              <TabPane tab="화물선" key="cargo">
                {filteredShipList
                  .filter((v) => {
                    const { kind } = v;

                    return (
                      kind === '화물선' ||
                      kind === '예부선' ||
                      kind === '유조선'
                    );
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleShipClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
              <TabPane tab="기타선" key="etc">
                {filteredShipList
                  .filter((v) => {
                    const { kind } = v;

                    return kind === '기타선';
                  })
                  .map((v) => {
                    return (
                      <div
                        className="vessel-box"
                        onClick={() => {
                          handleShipClick(v);
                        }}
                      >
                        {v.name}
                      </div>
                    );
                  })}
              </TabPane>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
