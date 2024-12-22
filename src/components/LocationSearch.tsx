import React, { FC, useState, useEffect, useRef } from 'react';
import { Input, Button, Space, List, Card } from 'antd';

declare global {
  interface Window {
    AMap: any;
  }
}

interface LocationSearchProps {
  onSearch: (location: string) => void;
  onSelectLocation: (location: any) => void;
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  location: {
    lng: number;
    lat: number;
  };
}

const LocationSearch: FC<LocationSearchProps> = ({ onSearch, onSelectLocation }) => {
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const placeSearchRef = useRef<any>(null);

  useEffect(() => {
    if (window.AMap) {
      window.AMap.plugin(['AMap.PlaceSearch'], () => {
        placeSearchRef.current = new window.AMap.PlaceSearch({
          city: '长沙'
        });
      });
    }
  }, []);

  const handleSearch = () => {
    if (location.trim() && placeSearchRef.current) {
      setLoading(true);
      placeSearchRef.current.search(location.trim(), (status: string, result: any) => {
        setLoading(false);
        if (status === 'complete' && result.poiList?.pois) {
          setSearchResults(result.poiList.pois);
        }
      });
    }
  };

  const handleSelect = (item: any) => {
    onSelectLocation(item);
    setSearchResults([]);
    setLocation(item.name);
  };

  const style = document.createElement('style');
  style.textContent = `
    .search-result-item:hover {
      background-color: #f5f5f5;
    }
    
    /* 自定义滚动条样式 */
    .ant-card-body::-webkit-scrollbar {
      width: 6px;
    }
    
    .ant-card-body::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 3px;
    }
    
    .ant-card-body::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }
  `;
  document.head.appendChild(style);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Input 
          placeholder="请输入地点（如：医院）" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          搜索
        </Button>
      </Space>

      {searchResults.length > 0 && (
        <Card 
          size="small" 
          title="搜索结果" 
          style={{ 
            marginTop: 16,
            maxHeight: '400px',
            overflow: 'hidden'
          }}
          bodyStyle={{
            maxHeight: '350px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          <List
            size="small"
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item 
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.3s',
                  padding: '8px 12px'
                }}
                className="search-result-item"
              >
                <List.Item.Meta
                  title={item.name}
                  description={item.address}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </Space>
  );
};

export default LocationSearch;