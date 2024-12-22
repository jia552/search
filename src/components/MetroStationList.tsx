import React, { FC, useMemo } from 'react';
import { List, Card, Tag, Space, Typography, Tabs } from 'antd';

const { Text } = Typography;
const { TabPane } = Tabs;

interface MetroStation {
  id: string;
  name: string;
  distance: number;
  address: string;
  lines: string[];
}

interface MetroStationListProps {
  stations: MetroStation[];
  loading?: boolean;
}

const lineColors: { [key: string]: string } = {
  '1': '#E70012',
  '2': '#009944',
  '3': '#F39800',
  '4': '#522886',
  '5': '#0066CC',
  '6': '#FF9999'
};

const StationListItem: FC<{ station: MetroStation }> = ({ station }) => (
  <List.Item
    style={{
      padding: '12px 8px',
      borderRadius: '4px',
      marginBottom: '8px',
      border: '1px solid #f0f0f0'
    }}
  >
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <Text strong style={{ fontSize: '15px' }}>
          {station.name}
        </Text>
        <Space size={4}>
          {station.lines.map(line => (
            <Tag 
              key={line}
              color={lineColors[line] || '#999'}
              style={{ 
                margin: 0,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {line}号线
            </Tag>
          ))}
        </Space>
      </div>
      <div style={{ 
        fontSize: '13px', 
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Text type="secondary">
          {station.address}
        </Text>
        <Text type="secondary" strong>
          {(station.distance / 1000).toFixed(2)} km
        </Text>
      </div>
    </div>
  </List.Item>
);

const MetroStationList: FC<MetroStationListProps> = ({ stations, loading }) => {
  // 按线路分组站点
  const stationsByLine = useMemo(() => {
    const groups: { [key: string]: MetroStation[] } = { all: stations };
    
    stations.forEach(station => {
      station.lines.forEach(line => {
        if (!groups[line]) {
          groups[line] = [];
        }
        groups[line].push(station);
      });
    });

    // 对每个分组内的站点按距离排序
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.distance - b.distance);
    });

    return groups;
  }, [stations]);

  return (
    <Card 
      title={
        <Text strong style={{ fontSize: '16px' }}>
          附近地铁站 ({stations.length})
        </Text>
      }
      style={{ 
        marginTop: 16,
        maxHeight: '600px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{
        maxHeight: '550px',
        overflowY: 'auto',
        padding: '0 8px'
      }}
    >
      <Tabs defaultActiveKey="all">
        <TabPane 
          tab={
            <span>
              全部
              <Tag style={{ marginLeft: 8 }}>{stations.length}</Tag>
            </span>
          } 
          key="all"
        >
          <List
            loading={loading}
            dataSource={stationsByLine.all}
            renderItem={(station) => <StationListItem station={station} />}
            locale={{ emptyText: '暂无附近地铁站' }}
          />
        </TabPane>
        {Object.keys(stationsByLine)
          .filter(key => key !== 'all')
          .sort((a, b) => Number(a) - Number(b))
          .map(line => (
            <TabPane
              tab={
                <span>
                  <Tag 
                    color={lineColors[line]} 
                    style={{
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {line}号线
                  </Tag>
                  <Tag style={{ marginLeft: 4 }}>{stationsByLine[line].length}</Tag>
                </span>
              }
              key={line}
            >
              <List
                loading={loading}
                dataSource={stationsByLine[line]}
                renderItem={(station) => <StationListItem station={station} />}
                locale={{ emptyText: '暂无该线路地铁站' }}
              />
            </TabPane>
          ))}
      </Tabs>
    </Card>
  );
};

// 添加自定义样式
const style = document.createElement('style');
style.textContent = `
  .ant-list-item:hover {
    background-color: #fafafa;
    transition: all 0.3s;
  }
  
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

  .ant-tabs-nav {
    margin-bottom: 12px !important;
  }
`;
document.head.appendChild(style);

export default MetroStationList;