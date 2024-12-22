import React, { FC, useEffect, useRef } from 'react';
import { notification } from 'antd';

interface AMapProps {
  selectedLocation?: any;
  onMetroStationsFound?: (stations: any[]) => void;
}

declare global {
  interface Window {
    AMap: any;
  }
}

const SEARCH_RADIUS = 10000; // 设置搜索半径为 10 公里

const AMap: FC<AMapProps> = ({ selectedLocation, onMetroStationsFound }) => {
  const mapRef = useRef<any>(null);
  const placeSearchRef = useRef<any>(null);

  // 搜索方法
  const searchNearbyMetro = (location: any) => {
    if (!mapRef.current) {
      notification.error({ message: '地图服务未初始化' });
      return;
    }

    // 设置搜索参数
    const searchOptions = {
      city: '长沙市',  // 明确指定城市
      citylimit: true, // 限制在城市内搜索
      pageSize: 1,
      pageIndex: 1
    };

    // 更新搜索实例配置
    placeSearchRef.current.setCity('长沙市');
    placeSearchRef.current.setCityLimit(true);

    // 执行搜索
    placeSearchRef.current.search(location.name, (status: string, result: any) => {
      console.log('搜索状态:', status);
      console.log('搜索结果:', result);

      if (status === 'complete' && result.poiList?.pois?.length > 0) {
        const location = result.poiList.pois[0];
        
        // 清除之前的标记
        mapRef.current?.clearMap();

        // 标记搜索的地点
        const searchMarkerContent = `
          <div class="search-marker">
            <div class="search-icon">
              <div class="pulse"></div>
            </div>
            <div class="search-name">${location.name}</div>
          </div>
        `;

        new window.AMap.Marker({
          map: mapRef.current,
          position: [location.location.lng, location.location.lat],
          content: searchMarkerContent,
          offset: new window.AMap.Pixel(-15, -30),
          title: location.name
        });

        // 添加搜索点的样式
        const searchStyle = document.createElement('style');
        searchStyle.textContent = `
          .search-marker {
            position: relative;
            cursor: pointer;
          }
          .search-icon {
            width: 24px;
            height: 24px;
            background: #ff4d4f;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 8px rgba(255,77,79,0.5);
          }
          .pulse {
            width: 16px;
            height: 16px;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
          .search-name {
            position: absolute;
            white-space: nowrap;
            background: rgba(255,255,255,0.95);
            color: #ff4d4f;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 2px;
            font-size: 13px;
            top: -28px;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          }
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            50% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(0.8);
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(searchStyle);

        // 立即将地图中心设置到搜索位置
        mapRef.current.setZoomAndCenter(15, [location.location.lng, location.location.lat], false);

        // 搜索附近地铁站
        const nearbySearch = new window.AMap.PlaceSearch({
          type: '地铁站',
          pageSize: 50,
          pageIndex: 1,
          radius: SEARCH_RADIUS, // 使用常量
          extensions: 'all'
        });

        nearbySearch.searchNearBy(
          '', 
          [location.location.lng, location.location.lat], 
          SEARCH_RADIUS,  // 使用相同的常量
          (status: string, result: any) => {
            if (status === 'complete' && result.poiList?.pois?.length > 0) {
              const stations = result.poiList.pois;
              
              // 处理站名并分组
              const stationMap = new Map();
              stations.forEach((station: any) => {
                // 标准化站名格式
                let cleanName = station.name
                  .replace(/[（(](地铁站)[)）]/g, '地铁站')  // 统一地铁站的括号格式
                  .replace(/地铁站[0-9号口]+/g, '地铁站')     // 去除数字号口
                  .replace(/地铁站[A-Z]口/g, '地铁站')        // 去除字母口
                  .replace(/地铁站出入口/g, '地铁站')         // 去除出入口字样
                  .replace(/地铁站[东南西北]口/g, '地铁站')   // 去除方向口
                  .replace(/[\s]/g, '')                      // 去除空格
                  .trim();

                // 提取线路信息
                const lines = new Set<string>();
                station.address.split(';').forEach((line: string) => {
                  const match = line.match(/(\d+)号线/);
                  if (match) {
                    lines.add(match[1]);
                  }
                });

                // 如果站名中没有"地铁站"字样，添加它
                if (!cleanName.includes('地铁站')) {
                  cleanName += '地铁站';
                }

                // 如果这个清理后的站名还没有被记录，或者新的距离更近
                if (!stationMap.has(cleanName) || stationMap.get(cleanName).distance > station.distance) {
                  const distance = window.AMap.GeometryUtil.distance(
                    [location.location.lng, location.location.lat],
                    [station.location.lng, station.location.lat]
                  );

                  stationMap.set(cleanName, {
                    id: station.id,
                    name: cleanName,
                    address: Array.from(lines).map(line => `${line}号线`).join(';'),
                    distance: distance,
                    location: station.location,
                    lines: Array.from(lines)
                  });
                }
              });

              const uniqueStations = Array.from(stationMap.values());
              console.log('处理后的地铁站数据:', uniqueStations);

              // 清除之前的标记
              mapRef.current?.clearMap();

              // 添加搜索点标记
              const searchMarkerContent = `
                <div class="search-marker">
                  <div class="search-icon">
                    <div class="pulse"></div>
                  </div>
                  <div class="search-name">${location.name}</div>
                </div>
              `;

              new window.AMap.Marker({
                map: mapRef.current,
                position: [location.location.lng, location.location.lat],
                content: searchMarkerContent,
                offset: new window.AMap.Pixel(-15, -30),
                title: location.name
              });

              // 只为唯一的地铁站添加标记
              uniqueStations.forEach((station: any) => {
                const stationMarkerContent = `
                  <div class="metro-marker">
                    <div class="metro-icon">
                      <img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" />
                    </div>
                    <div class="metro-name">${station.name}</div>
                  </div>
                `;

                new window.AMap.Marker({
                  map: mapRef.current,
                  position: [station.location.lng, station.location.lat],
                  content: stationMarkerContent,
                  offset: new window.AMap.Pixel(-15, -30),
                  title: station.name
                });
              });

              // 通知父组件更新地铁站列表
              if (onMetroStationsFound) {
                onMetroStationsFound(uniqueStations);
              }

              mapRef.current?.setFitView();
              notification.success({ message: `找到 ${uniqueStations.length} 个地铁站` });
            } else {
              notification.warning({ message: '未找到附近地铁站' });
              if (onMetroStationsFound) {
                onMetroStationsFound([]);
              }
            }
          }
        );

        notification.success({ message: `已定位到: ${location.name}` });
      } else {
        notification.warning({ message: '未找到该地点' });
      }
    });
  };

  useEffect(() => {
    const initMap = () => {
      const map = new window.AMap.Map('container', {
        zoom: 11,
        center: [112.982279, 28.19409]
      });
      
      mapRef.current = map;

      map.plugin(['AMap.PlaceSearch'], () => {
        placeSearchRef.current = new window.AMap.PlaceSearch({
          city: '长沙'
        });
      });

      map.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        map.addControl(new window.AMap.ToolBar());
        map.addControl(new window.AMap.Scale());
      });
    };

    if (window.AMap) {
      initMap();
    } else {
      const checkAMap = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkAMap);
          initMap();
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      searchNearbyMetro(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div 
      id="container" 
      style={{ 
        height: '500px', 
        width: '100%',
        border: '1px solid #ccc'
      }}
    ></div>
  );
};

export default AMap;