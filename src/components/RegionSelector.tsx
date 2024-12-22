import React, { FC } from 'react';
import { Select } from 'antd';

interface RegionSelectorProps {
  onRegionChange: (region: string) => void;
}

const RegionSelector: FC<RegionSelectorProps> = ({ onRegionChange }) => {
  const cities = [
    { value: 'changsha', label: '长沙' },
    // 可以添加更多城市
  ];

  return (
    <Select
      placeholder="请选择城市"
      style={{ width: 200 }}
      options={cities}
      onChange={onRegionChange}
      defaultValue="changsha"
    />
  );
};

export default RegionSelector;