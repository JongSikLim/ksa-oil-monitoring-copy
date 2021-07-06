import { produce } from 'immer';
import { deleteCookie, setCookie } from 'utils';

const LOGIN = 'SESSION/LOGIN';
const LOGOUT = 'SESSION/LOGOUT';
const USE_SESSION = 'SESSION/USE_SESSION';

const initialState = {
  isLogin: false,
  user: {
    emp_no: null,
    emp_name: null,
    dept_code: null,
    level: null,
    token: null,
  },
};

export const loginActions = {
  login: (payload) => {
    return {
      type: LOGIN,
      payload,
    };
  },
  logout: () => {
    return {
      type: LOGOUT,
    };
  },
  useSession: (userInfo) => {
    return {
      type: USE_SESSION,
      payload: userInfo,
    };
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return produce(state, (draftState) => {
        draftState.user = {
          ...action.payload,
        };
        setCookie('userInfo', JSON.stringify(action.payload));
      });
    case LOGOUT:
      return produce(state, (draftState) => {
        draftState.isLogin = false;
        deleteCookie('userInfo', { path: '/', domain: 'localhost' });
      });
    case USE_SESSION:
      return produce(state, (draftState) => {
        draftState.isLogin = true;
        draftState.user = {
          ...action.payload,
        };
        const newCk = JSON.stringify(action.payload);
        setCookie('userInfo', newCk);
      });
    default:
      return state;
  }
};

export default reducer;
