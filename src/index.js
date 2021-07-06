import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import 'moment/locale/ko';
import { ConfigProvider } from 'antd';
import koKR from 'antd/es/locale/ko_KR';

import store from './redux';
import { Provider } from 'react-redux';

import './common.scss';
import 'c3/c3.css';
import 'antd/lib/modal/style/css';
import 'antd/lib/table/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/input-number/style/css';
import 'antd/lib/switch/style/css';
import 'antd/lib/popover/style/css';

import 'antd/dist/antd.css';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <ConfigProvider locale={koKR}>
          <App />
        </ConfigProvider>
      </Router>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
