import './style/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import configureStore from './configureStore';
import { BUILD_TAB_ENABLED } from './config';

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    <App buildEnabled={BUILD_TAB_ENABLED} />
  </Provider>
), document.getElementById('root'));
