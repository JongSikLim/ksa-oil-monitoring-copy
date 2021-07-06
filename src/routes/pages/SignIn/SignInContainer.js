/**
 *
 *
 */

import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SignInPresenter from './SignInPresenter';
import { AuthAPI } from 'api';
import { useDispatch } from 'react-redux';
import { loginActions } from 'redux/reducer/session';
// import MessageAlert from 'utils/MessageAlert';
// import { getCookie, setCookie } from 'utils';
// import { checkSession } from 'utils/esManager';

/**
 * 로그인 컨테이너
 * --
 */
const SignInContainer = () => {
  /* Redux */
  const dispatch = useDispatch();

  /* Router */
  const history = useHistory();

  /* State */
  // 로딩
  const [loading, setLoading] = useState(null);
  // 로그인정보
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  });

  /* Hooks */
  /**
   * 초기로딩
   */
  useEffect(() => {
    return () => {};
  }, []);

  /* Functions */
  /**
   *
   */
  const handleChangeValue = ({ target }) => {
    setUserInfo({
      ...userInfo,
      [target.name]: target.value,
    });
  };

  /**
   * @title
   * @description
   */
  const handlePressKey = ({ code }) => {
    if (code === 'Enter') {
      handleLogin();
    }
  };

  /**
   * 로그인
   * --
   */
  const handleLogin = async () => {
    let { status, data } = await AuthAPI.signinTest(userInfo);

    if (status) {
      dispatch(loginActions.login(data));
      history.push('/m/particular');
      return true;
    } else {
      return false;
    }
  };

  /* RENDER */
  return (
    <SignInPresenter
      onLogin={handleLogin}
      onChangeValue={handleChangeValue}
      onKeyPress={handlePressKey}
      loading={loading}
      setLoading={setLoading}
      userInfo={userInfo}
    />
  );
};

/* Exports */
export default SignInContainer;
