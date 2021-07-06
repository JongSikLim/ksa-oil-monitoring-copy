import { DatePicker, Input, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import CompanyManagerPresenter from './CompanyManagerPresenter';
import actionCreator, {
  selectCompanyFacadeAction,
} from 'redux/reducer/actionCreator';
import { VesselAPI, CompanyAPI } from 'api';
import moment from 'moment';
import { useHistory } from 'react-router';
import UPDATE_ICON from 'assets/images/icon_edit.png';
import {
  checkAvailable,
  checkAvailableUIComponent,
} from 'utils/authorizationManager';
import MessageAlert from 'utils/MessageAlert';

const { companyActions, vesselActions } = actionCreator;

const CompanyManagerContainer = () => {
  /* States */
  const dispatch = useDispatch();
  //SECTION 선사 관련 상태
  const [allCompanies, setAllCompanies] = useState([]); // 전체 선사 리스트
  const [companySearchValue, setCompanySearchValue] = useState(''); // 선사 등록 검색 텍스트
  const [filterCompaniesOnRegist, setFilterCompaniesOnRegist] = useState([]); // 전체 선사 리스트 중 필터링 된 선사 목록
  const companies = useSelector((state) => state.company.companies); // 비즈니스 선사 리스트
  const selectCompany = useSelector((state) => state.company.selectCompany); // 선택된 비즈니스 선사
  const [selectedCompanyOnRegist, setSelectedCompanyOnRegist] = useState(null); // 선사 등록 모달의 선택된 선사

  const { totalCompany, totalShip } = useSelector(
    (state) => state.company.serviceDataInfo
  );

  //SECTION 선박 관련 상태
  const [allVessels, setAllVessels] = useState([]); // 전체 선박 리스트
  const [vesselSearchValue, setVesselSearchValue] = useState(''); // 선박 등록 검색 텍스트
  const [filterVesselsOnRegist, setFilterVesselsOnRegist] = useState([]); // 전체 선박 리스트 중 필터링 된 선박 목록
  const [selectedVesselOnRegist, setSelectedVesselOnRegist] = useState(null); // 선박 등록 모달의 선택된 선박
  const { level } = useSelector((state) => state.session.user);

  const [aknowledgeManageOtherCompany, setAknowledgeManageOtherCompany] =
    useState(false);

  const [activeVesselUpdateAtColumn, setActiveVesselUpdateAtColumn] =
    useState(null); // 선박 수정 날짜 활성화 컬럼

  const history = useHistory();

  //SECTION 비즈니스 선사 검색 관련 상태
  const [businessCompanySearchValue, setbusinessCompanySearchValue] =
    useState('');
  const [filterBusinessCompanies, setfilterBusinessCompanies] = useState([]);

  /* Variables */
  // SECTION 선사 관련 메소드
  // 선사 리스트 테이블 컬럼 속성
  const companyTableColumn = [
    {
      title: '',
      dataIndex: 'index',
      align: 'center',
      width: '90px',
    },
    {
      title: (
        <p style={{ marginBottom: 0 }}>
          선사명{' '}
          <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
            ({totalCompany}업체)
          </span>
        </p>
      ),
      dataIndex: 'companyName',
      width: '360px',
      align: 'center',
      className: 'bold',
    },
    {
      title: (
        <p style={{ marginBottom: 0 }}>
          선박 척수{' '}
          <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
            ({totalShip}척)
          </span>{' '}
        </p>
      ),
      dataIndex: 'vesselCount',
      width: '155px',
      align: 'center',
    },
    {
      title: '생성 날짜',
      dataIndex: 'createdAt',
      width: '180px',
      align: 'center',
    },
  ];

  const companySearchBoxOptions = companies.map((c) => {
    const { companyId, name } = c;

    return {
      label: name,
      value: companyId,
    };
  });

  // 선사 리스트 테이블 데이터
  const companyTableDataSource = companies.map((c, i) => {
    const { companyId, name, ship, created } = c;

    return {
      index: i + 1,
      companyId: companyId,
      companyName: name,
      vesselCount: ship.length,
      createdAt: created,
      ships: ship,
    };
  });

  /* Functions */
  // 선사 리스트에서 선사 클릭 시 이벤트 처리
  const handleClickCompany = (companyId, name, vessels, code) => {
    CompanyAPI.getBusinessCompanies({ code })
      .then(({ info, rows }) => {
        const company = rows[0];

        batch(() => {
          selectCompanyFacadeAction(dispatch, company);
        });
      })
      .catch((err) => {
        batch(() => {
          selectCompanyFacadeAction(dispatch, selectCompany);
        });
      });
  };

  // 선사 등록 모달 클릭시 나오는 리스트를 API로 받아온다.
  const getAllComapnies = async () => {
    let allCompanies;
    try {
      allCompanies = await CompanyAPI.getCompanies();
    } catch (error) {
      allCompanies = [];
    }

    return allCompanies;
  };

  // 선사 등록 처리
  const handleInsertCompany = async () => {
    let response = await CompanyAPI.insertBusinessCompany({
      code: selectedCompanyOnRegist.code,
    });

    if (response) {
      const { info, rows } = await CompanyAPI.getBusinessCompanies();

      batch(() => {
        dispatch(companyActions.setServiceData(info));
        dispatch(companyActions.setCompanies(rows));
      });
    } else {
      //FIXME 에러 로그 표시 필요
      MessageAlert.error('선사 데이터 요청 오류');
    }
  };

  // SECTION 선박 관련 메소드
  // 선박 리스트 테이블 컬럼 속성
  const vesselListTableColumn = [
    {
      title: '　',
      dataIndex: 'index',
      align: 'center',
      width: '60px',
      align: 'center',
    },
    {
      title: '선박명',
      dataIndex: 'vesselName',
      align: 'center',
      width: '210px',
      className: 'bold',
      align: 'center',
    },
    {
      title: '선박번호',
      dataIndex: 'vesselNumber',
      width: '132px',
      align: 'center',
    },
    {
      title: '관리번호',
      dataIndex: 'manageNumber',
      width: '132px',
      align: 'center',
    },
    {
      title: '관리여부',
      dataIndex: 'isManage',
      width: '85px',
      align: 'center',
      className: 'none-padding',
      render: (text, record, index) => {
        return (
          <Switch
            disabled={!checkAvailable(level, 1)}
            checked={record.isManage}
            onChange={(value) => {
              const nowDateString = moment(moment.now()).format('YYYY-MM-DD');

              batch(() => {
                dispatch(
                  companyActions.updateCompanyShip(
                    selectCompany.companyId,
                    index,
                    'manage',
                    value
                  )
                );
                dispatch(
                  companyActions.updateCompanyShip(
                    selectCompany.companyId,
                    index,
                    'updated',
                    nowDateString
                  )
                );
              });

              VesselAPI.updateVesselManage(record.id, {
                //FIXME BODY 수정
                manage: value,
                updated: nowDateString,
              }).then((res) => {});
            }}
            size="small"
          ></Switch>
        );
      },
    },
    {
      title: '관리 날짜',
      dataIndex: 'updatedAt',
      align: 'center',
      width: '172px',
      render: (text, record, index) => {
        const { id, isManage } = record;

        return (
          <div
            className="update-date-box"
            onDoubleClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
            }}
          >
            {activeVesselUpdateAtColumn === id ? (
              <DatePicker
                size="small"
                style={{ width: '50%' }}
                suffixIcon={false}
                autoFocus={true}
                defaultOpen={true}
                onChange={(date, dateString) => {
                  setActiveVesselUpdateAtColumn(null);

                  VesselAPI.updateVesselManage(record.id, {
                    manage: isManage,
                    updated: dateString,
                  }).then((res) => {
                    dispatch(
                      companyActions.updateCompanyShip(
                        selectCompany.companyId,
                        index,
                        'updated',
                        date
                      )
                    );
                  });
                }}
              />
            ) : (
              <span className="date-text">{text}</span>
            )}

            {checkAvailableUIComponent(level, 1, [
              <img
                src={UPDATE_ICON}
                alt=""
                className="update-icon"
                onClick={() => {
                  setActiveVesselUpdateAtColumn(id);
                }}
              />,
              <></>,
            ])}
          </div>
        );
      },
    },
  ];

  // 선박 리스트 테이블 데이터
  const vesselTableDataSource = selectCompany.ship.map((s, i) => {
    const { shipId, name, code, manageCode, manage, anotherManage, updated } =
      s;
    return {
      index: i + 1,
      id: shipId,
      vesselName: name,
      vesselNumber: code,
      manageNumber: manageCode,
      isManage: manage,
      updatedAt: moment(updated).format('YYYY-MM-DD'),
    };
  });

  /**
   * @title 선박 더블 클릭 이벤트 핸들러
   * @description 선박 더블 클릭시 선박 제원 정보 페이지로 이동 처리
   * @param {*} id 선박 id 값
   */
  const handleDoubleClickVessel = (id) => {
    dispatch(vesselActions.setVessel(id));
    history.push('/m/particular');
  };

  // 선박 등록 모달 클릭시 나오는 리스트를 API로 받아온다.
  const getAllVessels = async () => {
    let allVessels = await VesselAPI.getVessels();

    return allVessels;
  };

  //선박 등록 처리
  const handleInsertVessel = async () => {
    const response = await VesselAPI.insertVessels({
      companyId: selectCompany.companyId,
      shipCode: selectedVesselOnRegist.code.trim(),
      manageCode: selectedVesselOnRegist.manageCode,
      manage: true,
    });

    if (response) {
      const _response = await CompanyAPI.getBusinessCompanies();
      const { rows } = _response;
      const selectedCompany = rows.find((c) => {
        return c.companyId === selectCompany.companyId;
      });
      console.log('selectedCompany: ', selectedCompany);

      dispatch(companyActions.setCompanies(rows));
      selectCompanyFacadeAction(dispatch, selectedCompany);

      // const { ship } = selectedCompany;
      // dispatch(companyActions.setCompany(selectCompany.companyId));
      // dispatch(vesselActions.setVessels(ship));
    } else {
      //FIXME 에러 로그 표시 필요
      message.error('선박 등록 실패');
    }
  };

  /* Hooks */
  // SECTION 선사 관련 훅
  useEffect(async () => {
    let response = await getAllComapnies();
    const { rows, info } = response;

    setAllCompanies(rows);
  }, []);

  // 회사 검색 결과 반환 훅
  useEffect(() => {
    const filterResult = allCompanies.filter((c) => {
      const { name, code } = c;
      try {
        return (
          name.includes(companySearchValue) || code.includes(companySearchValue)
        );
      } catch (error) {
        return false;
      }
    });
    setFilterCompaniesOnRegist(filterResult);

    return () => {
      setFilterVesselsOnRegist([]);
    };
  }, [companySearchValue, allCompanies]);

  //SECTION 선박 관련 훅
  useEffect(async () => {
    const response = await getAllVessels();
    const { rows = [], info } = response;

    setAllVessels(rows);
  }, []);

  //선박 검색 결과 반환 훅
  useEffect(() => {
    const filterResult = allVessels.filter((v) => {
      const { name, manageCode } = v;

      try {
        return (
          name.includes(vesselSearchValue) ||
          manageCode.includes(vesselSearchValue)
        );
      } catch (error) {
        return false;
      }
    });
    setFilterVesselsOnRegist(filterResult);

    return () => {
      setFilterVesselsOnRegist([]);
    };
  }, [vesselSearchValue, allVessels]);

  //SECTION 비즈니스 선사 관련 훅
  useEffect(() => {
    let filteredCompanies = companies
      .filter((c) => {
        const { name, companyCode } = c;

        return (
          name.includes(businessCompanySearchValue) ||
          companyCode.includes(businessCompanySearchValue)
        );
      })
      .map((c, i) => {
        const { companyId, name, ship, created, companyCode } = c;

        return {
          index: i + 1,
          companyId: companyId,
          companyName: name,
          companyCode: companyCode,
          vesselCount: ship.length,
          createdAt: moment(created).format('YYYY-MM-DD'),
          ships: ship,
        };
      });

    setfilterBusinessCompanies(filteredCompanies);
    return () => {
      setfilterBusinessCompanies([]);
    };
  }, [businessCompanySearchValue, companies]);

  return (
    <CompanyManagerPresenter
      selectCompany={selectCompany}
      companySearchBoxOptions={companySearchBoxOptions}
      companyTableColumn={companyTableColumn}
      companyTableDataSource={companyTableDataSource}
      vesselListTableColumn={vesselListTableColumn}
      vesselTableDataSource={vesselTableDataSource}
      handleClickCompany={handleClickCompany}
      companySearchValue={companySearchValue}
      setCompanySearchValue={setCompanySearchValue}
      filterCompaniesOnRegist={filterCompaniesOnRegist}
      setFilterCompaniesOnRegist={setFilterCompaniesOnRegist}
      selectedCompanyOnRegist={selectedCompanyOnRegist}
      setSelectedCompanyOnRegist={setSelectedCompanyOnRegist}
      vesselSearchValue={vesselSearchValue}
      setVesselSearchValue={setVesselSearchValue}
      filterVesselsOnRegist={filterVesselsOnRegist}
      setFilterVesselsOnRegist={setFilterVesselsOnRegist}
      selectedVesselOnRegist={selectedVesselOnRegist}
      setSelectedVesselOnRegist={setSelectedVesselOnRegist}
      aknowledgeManageOtherCompany={aknowledgeManageOtherCompany}
      setAknowledgeManageOtherCompany={setAknowledgeManageOtherCompany}
      handleInsertCompany={handleInsertCompany}
      handleInsertVessel={handleInsertVessel}
      businessCompanySearchValue={businessCompanySearchValue}
      setbusinessCompanySearchValue={setbusinessCompanySearchValue}
      filterBusinessCompanies={filterBusinessCompanies}
      handleDoubleClickVessel={handleDoubleClickVessel}
    />
  );
};

export default CompanyManagerContainer;
