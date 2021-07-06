/**
 *
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import './SignIn.css';
import LOGO from 'assets/images/full_logo.png';
import BG from 'assets/images/login_bg.png';

/**
 * 로그인 프레젠터
 * --
 */
const SiginInPresenter = ({
  onLogin,
  loading,
  setLoading,
  onChangeValue,
  onKeyPress,
  userInfo,
}) => {
  /* State */
  const [authError, setAuthError] = useState(''); // 'error'

  /* RENDER */
  return (
    <div className="signin-container">
      <div className="signin-flex-box">
        {/* 로그인 이미지 */}
        <div>
          <img src={LOGO} alt="" width={240} />
        </div>

        {/* 로그인 문구 */}
        <div className="signin-title-area">
          <p>
            LOGIN
            <br />
            안녕하세요. 방문을 환영합니다!
          </p>
        </div>

        {/*  */}
        <div className="signin-input-area">
          <div className="input-box">
            <input
              className={`login-form-input-field ${authError}`}
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={userInfo.username}
              onChange={onChangeValue}
              onKeyPress={onKeyPress}
            />
          </div>
          <div className="input-box">
            <input
              className={`login-form-input-field ${authError}`}
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={userInfo.password}
              onChange={onChangeValue}
              onKeyPress={onKeyPress}
            />
          </div>
        </div>

        {/*  */}
        <div className="signin-interface-area">
          <button id="loginBtn" onClick={onLogin}>
            {loading === 'ING' ? 'Loading...' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiginInPresenter;
