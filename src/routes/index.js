import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Main, SignIn } from './pages';
import { AuthAPI } from 'api';
import { useDispatch } from 'react-redux';
import { loginActions } from 'redux/reducer/session';
import MessageAlert from 'utils/MessageAlert';
import { getCookie } from 'utils';
import {} from 'layout';

/**
 *
 * --
 */
const Routes = () => {
  /* Redux */
  const dispatch = useDispatch();

  /* Router */
  const history = useHistory();

  /* Functions */
  /**
   * 세션체크
   * --
   */
  const handleCheckVerification = async () => {
    try {
      const token = getCookie('KSA_ACCESS_TOKEN');
      if (!token) {
        MessageAlert.error('세션이 초기화 되었습니다. 다시 로그인 해주세요');
        history.push('/');
        return;
      }
      const data = await AuthAPI.sessionVerification();

      if (data) {
        dispatch(loginActions.login(data));
      } else {
        MessageAlert.error('세션이 초기화 되었습니다. 다시 로그인 해주세요');
        history.push('/');
        return;
      }
    } catch (e) {
      MessageAlert.error('페이지를 새로고침 해주세요');
      return;
    }
  };

  /* Hooks */
  /**
   *
   */
  useEffect(() => {
    handleCheckVerification();
  }, []);

  /* RENDER */
  return (
    <Switch>
      <Route path="/m" component={Main} />
      <Route path="/" component={SignIn} />
      <Route path="*">NOT MATCH</Route>
    </Switch>
  );
};

export default Routes;
