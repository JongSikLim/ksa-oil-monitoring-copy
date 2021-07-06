import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Header } from './components';
import { loginActions } from 'redux/reducer/session';

import './MainLayout.css';
import { getCookie } from 'utils';

const MainLayout = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // checkSession();
  // }, []);

  const checkSession = async () => {
    const session = await JSON.parse(getCookie('userInfo'));
    if (!session) {
      history.push('/login');
      return;
    }

    dispatch(loginActions.useSession(session));
  };

  return (
    <div className="site-layout-container">
      <Header />
      <div className="content" id="mainContent">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
