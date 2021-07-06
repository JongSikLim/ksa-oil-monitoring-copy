/**
 * @title 권한 체크
 * @description 사용자 레벨과 서비스의 권한 레벨을 통해서 통과 여부 반환
 * @param userLevel 사용자 권한 레벨
 * @param requestLevel 메뉴 사용 권한 레벨
 * @returns {boolean} 통과여부
 */
export const checkAvailable = (userLevel, requestLevel) => {
  return requestLevel < userLevel;
};

/**
 * @title 권한에 따른 컴포넌트 visible 셋팅
 * @description 사용자의 권한 레벨을 기준으로 컴포넌트가 어떻게 보여질 것인지 반환
 * @param userLevel 사용자 권한 레벨
 * @param requestLevel 메뉴 사용 권한 레벨
 * @param [authorizeComponent, notAuthorizeComponent] 통과시 컴포넌트, 실패시 컴포넌트
 * @returns {ReactComponent} 반환되는 컴포넌트
 */
export const checkAvailableUIComponent = (
  userLevel,
  requestLevel,
  [authorizeComponent = <></>, notAuthorizeComponent = <></>]
) => {
  return requestLevel < userLevel ? authorizeComponent : notAuthorizeComponent;
};
