import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App 组件测试', () => {
  test('渲染标题', () => {
    render(<App />);
    const titleElement = screen.getByText(/地铁站查询系统/i);
    expect(titleElement).toBeInTheDocument();
  });

  // 可以添加更多测试用例
  test('渲染城市选择器', () => {
    render(<App />);
    const selectElement = screen.getByPlaceholderText(/请选择城市/i);
    expect(selectElement).toBeInTheDocument();
  });
});