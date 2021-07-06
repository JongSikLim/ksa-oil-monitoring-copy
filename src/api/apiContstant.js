import { API_SERVER_URL } from 'utils';

export default {
  //SECTION 0. KSA 인증
  KSA_AUTH_SERVE_URL: 'TESTTETSSTEST',
  // 로그인
  LOGIN: `/user/login`,

  //SECTION 1. 선사, 선박 관리

  // 조합 관리 선사 목록 가져오기
  GET_ALL_COMPANY_LIST: `/source/company`,

  // 비지니스 선사 목록 가져오기
  GET_BUSINESS_COMPANY_LIST: `/company`,

  // 비지니스 선사 등록
  INSERT_BUSINESS_COMPANY: `/company`,

  // 조합 관리 선박 목록 가져오기
  GET_ALL_VESSEL_LIST: `/source/ship`,

  // 비지니스 선박 등록
  INSERT_BUSINESS_VESSEL: `/ship`,

  // 비지니스 선박 관리 여부 수정
  UPDATE_VESSEL_MANAGE: `/ship/:shipId`,

  // 관리 선박 현황 출력
  EXPORT_MANAGE_VESSEL: `/excel/summary`,

  //SECTION 2. 선박 제원 관리 페이지

  //선사의 선박 제원 상태 목록
  GET_COMPANY_VESSEL_PARTICULAR: `/company/:companyId/ship`,

  //선박 제원(SH) 가져오기 & 등록
  GETnINSERT_VESSEL_PARTICULAR: `/ship/:shipId/sh`,

  //선박 제원 수정
  UPDATE_VESSEL_PARTICULAR: `/ship/:shipId/sh/:shipInfold`,

  //엔진제조사 목록 가져오기
  GET_ENGIN_MAKER: `/engine`,

  //엔진 제원(EN) 가져오기 & 등록
  GETnINSERT_ENGINE_PARTICULAR: `/ship/:shipId/en`,

  //엔진 제원 수정
  UPDATE_ENGINE_PARTICULAR: `/ship/:shipId/en/:shipEngineId`,

  //선박 AIS 재수집
  GET_RECOLLECT_AIS_DATA: `/ais/recollect/:shipId`,

  //SECTION 3. 엔진 목록

  // 메인 엔진 목록
  GET_MAIN_ENGINE_LIST: `/mainengine`,

  // 서브 엔진 목록
  GET_SUB_ENGINE_LIST: `/subengine`,
  //SECTION 4. 선속소모량
  GR_TABLE_URL: `/ship/:shipId/gr`,

  //SECTION 5. 소요량기준표
  //소요량기준표 (도선 외)
  TA_TABLE_URL: `/ship/:shipId/ta`,
  //소요량기준표 (도선)
  TA_TABLE_FERRY_URL: `/ship/:shipId/ferry/ta`,
  //소요량기준표 등록 (도선)
  INSERT_TA_INFO: `/ship/:shipId/ferry/ta`,
  //소요량기준표 수정 (도선)
  UPDATE_TA_INFO: `/ship/:shipId/ferry/ta/:ferryShipId`,
  //선박 파일 리스트
  GET_FILE_LIST: `/ship/:shipId/file`,
  //선박 파일 업로드
  UPLOAD_FILE: `/ship/:shipId/fileUpload/ta`,
  //선박 파일 삭제
  DELETE_FILE: `/ship/file/:fileId`,
  //소요량 기준표 PDF 다운로드
  DOWNLOAD_TA_REPORT_PDF: `/pdf/ship/:shipId/ta`,
  //소요량 기준표 EXCEL 다운로드
  DOWNLOAD_TA_REPORT_EXCEL: `/excel/ship/:shipId/ta`,

  //SECTION 6. 선대모니터링
  // 전체 선박 데이터
  GET_SHIP_LIST: `/monitor`,
  // 선박 AIS 항적 데이터
  GET_SHIP_ROUTE: `/monitor/:mmsi/route?start=:start&end=:end`,

  //SECTION 7. 선박 연료유 관리
  //선박 연료유 데이터 조회
  GET_VESSEL_CONSUMPTION_INFO: `/oil/:shipId`,
  //선박 연료유 등록
  INSERT_VESSEL_CONSUMPTION_INFO: `/oil/:shipId`,
  //선박 연료유 수정
  UPDATE_VESSEL_CONSUMPTION_INFO: `/oil/:shipId/:manageId`,
  //선박 연료유 삭제
  DELETE_VESSEL_CONSUMPTION_INFO: `/oil/:shipId/:manageId`,
  //첨부 파일 등록
  UPLOAD_ROW_ATTACHMENT_FILE: `/oil/:shipId/:manageId/fileUpload`,
  //첨부 파일 삭제
  DELETE_ROW_ATTACHMENT_FILE: `/oil/file/:fileId`,
  //레포트 다운로드 엑셀
  DOWNLOAD_CONSUMPTION_INFO_REPORT_EXCEL: `/excel/oil/:shipId`,
  //레포트 다운로드 PDF
  DOWNLOAD_CONSUMPTION_INFO_REPORT_PDF: `/pdf/oil/:shipId`,
  //산출량 재계산
  RECALCULATION_CONSUMPTION_INFO: `/oil/recalculation/:shipId`,

  //SECTION 8. 소요량 계산
  //소요량 계산 기간별 소모량 검색
  GET_CALC_CONSUMPTION_SEARCH: `/oil/:shipId/search`,
  //소요량 계산 기간별 소모량 조회
  GET_CALC_CONSUMPTION_PERIOD: `/oil/:shipId/period`,
  //소요량 계산 기간별 소모량 추가
  INSERT_CALC_CONSUMPTION_PERIOD: `/oil/:shipId/period`,
  //소요량 계산 기간별 소모량 수정
  UPDATE_CALC_CONSUMPTION_PERIOD: `/oil/:shipId/period/:id`,
  //소요량 계산 기간별 소모량 수정
  DELETE_CALC_CONSUMPTION_PERIOD: `/oil/:shipId/period/:id`,
  //소요량 계산 레포트 다운로드 엑셀
  DOWNLOAD_CALC_CONSUMPTION_REPORT_EXCEL: `/excel/oil/:shipId/search`,
  //소요량 계산 레포트 다운로드 PDF
  DOWNLOAD_CALC_CONSUMPTION_REPORT_PDF: `/pdf/oil/:shipId/search`,

  //SECTION 9. 데이터 관리
  // 데이터 리스트
  GET_DATAMONITORING_LIST: `/datamanager`,
};
