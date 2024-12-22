import React, { FC, useState } from 'react';
import { Card, Space, Row, Col } from 'antd';
import RegionSelector from '../components/RegionSelector.tsx';
import LocationSearch from '../components/LocationSearch.tsx';
import AMap from '../components/AMap.tsx';
import MetroStationList from '../components/MetroStationList.tsx';

interface MetroStation {
  id: string;
  name: string;
  distance: number;
  address: string;
  lines: string[];
}

const MapPage: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('changsha');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [metroStations, setMetroStations] = useState<MetroStation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleMetroStationsFound = (stations: MetroStation[]) => {
    setMetroStations(stations);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="地铁站查询系统">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <RegionSelector onRegionChange={handleRegionChange} />
              <LocationSearch 
                onSearch={() => {}} 
                onSelectLocation={handleLocationSelect} 
              />
              <AMap 
                selectedLocation={selectedLocation}
                onMetroStationsFound={handleMetroStationsFound}
              />
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <MetroStationList 
            stations={metroStations}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MapPage;