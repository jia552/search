import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';  // 改用 antd v4 的样式
import './index.css';
import AppComponent from './App.tsx';

ReactDOM.render(
  <AppComponent />,
  document.getElementById('root')
);