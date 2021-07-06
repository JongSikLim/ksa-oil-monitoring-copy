import React, { useRef, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
// import MessageAlert from 'utils/MessageAlert';

// Side Component
import MapToggle from '../components/MapToggle';

// Ant design layout
import Icon from '@ant-design/icons';
import { Row, Col, Card } from 'antd';

// Ship Marker Image
import shipMarkerImage from 'assets/images/icon_monitoring_ship.png';
// Ship In Port Marker Image
import shipInPortImage from 'assets/images/icon_monitoring_ship_port.png';
// Ship Error Image
import shipErrorImage from 'assets/images/icon_error.png';
// Ship Dept Marker Image
import shipDeptImage from 'assets/images/icon_departure.png';
// Ship Route Marker Image
import shipRouteMarkerImageS from 'assets/images/shipRouteMarker1.png';
import shipRouteMarkerImageM from 'assets/images/shipRouteMarker2.png';
import shipRouteMarkerImageL from 'assets/images/shipRouteMarker3.png';

// 선박 마커 이미지
const images = [
    {
        id: 'shipMarker',
        file: shipMarkerImage
    },
    {
        id: 'shipInPort',
        file: shipInPortImage
    },
    {
        id: 'shipError',
        file: shipErrorImage
    },
    {
        id: 'shipDept',
        file: shipDeptImage
    },
    {
        id: 'shipRouteMarkerS',
        file: shipRouteMarkerImageS
    },
    {
        id: 'shipRouteMarkerM',
        file: shipRouteMarkerImageM
    },
    {
        id: 'shipRouteMarkerL',
        file: shipRouteMarkerImageL
    }
];

 // 선박 마커 마우스 오버 - 팝업 변수
let shipPopup = new window.mapboxgl.Popup({
    offset: [-20, -15],
    closeButton: false,
    closeOnClick: false,
    anchor: 'top-right',
    maxWidth: ''
});

 // 선박 마커 마우스 오버 - 팝업 변수
let routePopup = new window.mapboxgl.Popup({
    offset: [-10, -15],
    closeButton: false,
    closeOnClick: false,
    anchor: 'top-right',
    maxWidth: ''
});

// 의심 선박 아이콘 팝업 배열
// : 선박 선택시 마커는 지워지나 아이콘 팝업은 지워지지 않아서 배열로 관리함
let errPopup = [];

// 선박 마커 레이어 레이아웃 / 컬러 속성
const shipMarkerStyle = {
    layout: {
        'symbol-placement': 'point',
        'icon-image': ['get', 'iconName'],
        'icon-size': 1,
        'icon-rotate': {
            type: 'identity',
            property: 'heading',
        },
        'icon-pitch-alignment': 'viewport',
        'icon-rotation-alignment': 'map',
        'icon-ignore-placement': true,
        'icon-allow-overlap': true,
        'text-font': ['Spoqa Sans Neo Bold, Noto Sans CJK KR Bold, san-serif'],
        'text-field': ['get', 'name'],
        'text-offset': [1, -0.3],
        'text-anchor': 'left',
        'text-justify': 'left',
        'text-size': 12,
        'text-allow-overlap': true,
        'text-ignore-placement': false,
    },
    paint: {
        'text-color': '#000',
        'text-halo-color': '#fff',
        'text-halo-width': 1,
    }
}

// 항적 레이어 레이아웃 / 컬러 속성
const routeLineStyle = {
    layout: {
        'line-cap': 'round',
        'line-join': 'round',
    },
    paint: {
        'line-width': 6,
        'line-color': 'rgb(255, 204, 0)'
    }
}

// 항적 마커 레이어 레이아웃
const routeMarkerStyle = {
    layout: {
        'symbol-placement': 'point',
        'icon-image': {
            type: 'identity',
            property: 'iconName',
        },
        'icon-size': 1,
        'icon-pitch-alignment': 'viewport',
        'icon-rotation-alignment': 'map',
        'icon-rotate': {
            type: 'identity',
            property: 'heading',
        },
        'icon-ignore-placement': true,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-allow-overlap': true
    }
}

// const routeMarkerStyle = {
//     layout: {
//         'symbol-placement': 'point'
//     },
//     paint: {
//         'circle-color': '#FF0000',
//         'circle-radius': 4,
//         'circle-stroke-width': 2,
//         'circle-stroke-color': '#ffffff'
//     }
// }

// svg 아이콘 커스텀
const errorSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16">
        <g id="그룹_1861" data-name="그룹 1861" transform="translate(-271 -109)">
            <path id="다각형_4" data-name="다각형 4" d="M8.128,1.549a1,1,0,0,1,1.743,0l7.29,12.96A1,1,0,0,1,16.29,16H1.71a1,1,0,0,1-.872-1.49Z" transform="translate(271 109)" fill="#ff1a51"/>
            <rect id="사각형_809" data-name="사각형 809" width="2" height="5" transform="translate(279 115)" fill="#fff"/>
            <rect id="사각형_810" data-name="사각형 810" width="2" height="2" transform="translate(279 121)" fill="#fff"/>
        </g>
    </svg>
);
const ErrorIcon = props => <Icon component={errorSvg} {...props} />;

// Mapbox Token
window.mapboxgl.accessToken = 'pk.eyJ1IjoibGFiMDIxIiwiYSI6ImQwMjdmMDlhNzBmMTRmYTY3MDFhZjZiYmNkZDI0MWRhIn0.L5TmPocGj72LszJ3mDOAiQ';
let map;

// 선박 마커 레이어 소스에 삽입되는 features
let markerFeaturesRef = [];

const Map = (props) => {
    const {
        onAllShipList,
        onFilteredShipList,
        onSelectShip,        
        onShipInfo,
        onSelectDate,
        onShipRoute,
        
        harborData,
        harborDataLine,
        ecaData
    } = props;
    
    /* STATE */
    // 마우스 이동시 우측 상단 좌표 표시
    const [coord, setCoord] = useState([]);
    
    // 배출 규제 구역 표시
    const [ecaToggle, setECAToggle] = useState(false);
    
    // 항만 구역 표시
    const [harborToggle, setHarborToggle] = useState(false);
    
    // 선박 마커 레이어
    const [shipMarker, setShipMarker] = useState({});
    // 이전에 선택한 선박과 현재 선택한 선박을 구분하기 위한 변수
    const shipMarkerRef = useRef({ id: 0 });
    // const allShipListRef = useRef([]);
    // const filteredShipListRef = useRef([]);
    
    // Map Container
    const mapContainerRef = useRef(null);
    
    /* FUNCTIONS */
    /**
     * 선박 리스트 마커 생성
     * @param {string} renderType 최초 렌더링, 맵 클릭 이벤트 발생 구분 
     */
    const handleShipMarkers = (renderType = null) => {
        const features = renderType === 'mapClick' || renderType === 'null' ? handleShipFeatures(onAllShipList) : handleShipFeatures(onFilteredShipList);
        markerFeaturesRef = [{...features}];
        
        // shipMarker 상태 변경 시점
        // 1. 최초 렌더링시 생성(shipMarkerFeatures)
        // 2. 선박 선택시 + 과거 항적에 따라 마커 위치 변경시
        handleShipMarker('shipMarker', features).then((shipMarkerLayer) => {
            if (shipMarkerLayer.id) {
                setShipMarker(shipMarkerLayer);
                
                if (map.getLayer(shipMarkerLayer.id) === undefined) {
                    map.addLayer(shipMarkerLayer);
                } else {
                    map.getSource(shipMarkerLayer.id).setData({
                        type: 'FeatureCollection',
                        features
                    });
                }
                
                errPopup.map((pop) => {
                    pop.remove();
                });
                errPopup = [];
                
                // 의심 선박 에러 아이콘 출력
                shipMarkerLayer.source.data.features.map((feature) => {
                    if (feature.properties.suspect) {
                        const popup = new window.mapboxgl.Popup({
                            offset: [-22, 8],
                            closeButton: false,
                            closeOnClick: false,
                        }).setHTML('<img src=' + shipErrorImage + ' />').setLngLat(feature.geometry.coordinates).addTo(map);
                        
                        errPopup = [...errPopup, popup];
                    }
                });
            }
        }).catch((err) => {
            // console.log('err', err);
            
            setShipMarker({});
                
            if (map.getLayer('shipMarker') !== undefined) {
                map.removeLayer('shipMarker');
                map.removeSource('shipMarker');
            }
            
            // MessageAlert.warning('지도를 불러올 수 없습니다.');
        });
    };
    
    /**
     * 최초 페이지 로드, 과거 항적에 따른 마커 표시할 때 마커 세팅
     * @param {string} layerId map에서 참조하기 위한 레이어 id
     * @param {array} features source로 설정하기 위한 배열([{}, {}, {}...])
     */
    const handleShipMarker = async (layerId, features) => {
        const marker = await handleLayer(layerId, 'symbol', features, shipMarkerStyle.layout, shipMarkerStyle.paint);
        return marker;
    };
    
    /**
     * 항적 라인 레이어 
     * @param {string} layerId map에서 참조하기 위한 레이어 id
     * @param {array} features source로 설정하기 위한 배열([{}, {}, {}...])
     */
    const handleRouteLine = async (layerId, features, lineLayout, linePaint) => {
        const marker = await handleLayer(layerId, 'line', features, lineLayout, linePaint);
        return marker;
    };
    
    /**
     * 맵 오브젝트 생성을 위한 레이어 생성
     * @param {string} layerId 
     * @param {string} layerType 레이어 종류(marker: symbol / route: line)
     * @param {array} features source에 등록할 features
     * @param {object} layout 레이어 레이아웃
     * @param {object} paint 레이어 내 컬러, 폰트 등 스타일 속성
     */
    const handleLayer = (layerId, layerType, features, layout, paint) => {
        return {
            id: layerId,
            type: layerType,
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [ ...features ],
                }
            },
            layout,
            paint
        }
    };
    
    /**
     * 선박 마커 feature collection - source.data.features에 등록할 feature
     * @param {string} geometryType 맵에 표시할 feature의 타입
     * @param {array} coord 좌표
     * @param {object} prop feature 속성
     * @return {object} feature 객체
     */
    const handleFeature = (geometryType, coord, prop) => {
        return {
            type: 'Feature',
            geometry: {
                type: geometryType,
                coordinates: coord
            },
            properties: prop
        }
    };
    
    /**
     * 선박 리스트로 마커 features 생성
     * @param {array} shipList feature 생성할 선박 리스트
     */
    const handleShipFeatures = (shipList) => {
        let result = [];
        
        shipList.map((ship) => {
            ship = {
                ...ship,
                heading: ship.heading === undefined ? 0 : ship.heading,
                toggle: false,
                iconName: ship.speed < 2 ? 'shipInPort' : 'shipMarker'
            }
    
            // 선박 마커 feature 생성
            const feature = handleFeature('Point', [ship.longitude, ship.latitude], { ...ship });
                        
            result.push(feature);
        });
        
        return result;
    };
    
    /**
     * 항적 표시할 마커, 라인 레이어 세팅(drawSeaway_logger)
     * --
     * onShipRoute 항적 api 데이터가 없다면 실행되지 않음
     * @param {array} routeData 선박 항적 데이터
     * @return {array} routLine: 항적 레이어 / lineFeatures: 항적 레이어 소스 / markerFeatures: 선박 레이어 소스 / depCoord: 출발 마커 위치
     */
    const handleShipRoute = async (routeData) => {
        let coord, depCoord, heading, speed;
        
        // 항적에서 선박 마커가 표시되어야할 위치
        if (!routeData.length) {
            coord = [onSelectShip.longitude, onSelectShip.latitude];
            depCoord = null;
            heading = onSelectShip.heading;
            speed = onSelectShip.speed;
        } else if (routeData.length > 1) {
            // routeData의 가장 최신(마지막 위치) 데이터
            coord = [routeData[routeData.length - 1].longitude, routeData[routeData.length - 1].latitude];
            // 출발 마커 위치: 항적 데이터의 0번지 위치
            depCoord = [routeData[0].longitude, routeData[0].latitude];
            heading = routeData[routeData.length - 1].heading;
            speed = routeData[routeData.length - 1].speed;
        } else {
            // routeData의 가장 첫번째(제일 처음 위치) 데이터
            coord = [routeData[0].longitude, routeData[0].latitude];
            depCoord = [routeData[0].longitude, routeData[0].latitude];
            heading = routeData[0].heading;
            speed = routeData[0].speed;
        }        
        
        if (heading === undefined || isNaN(heading) || heading == '-') heading = 0;
        if (speed === undefined || isNaN(speed) || speed == '-') speed = 0;
        
        // 경도 180, -180도 체크
        const check = handleLonCheck(routeData);
        if (check) {
            if (coord[0] < 0) coord[0] = (180 + coord[0]) + 180;
        }
        
        // ======= 선박 마커 레이어
        // 마지막 날짜 위치 기준 선박으로 마커 feature 세팅
        // 선박 선택시 action에 properties는 전달되지 않으므로 iconName 재정의
        const ship = {
            ...onSelectShip,
            heading: onSelectShip.heading === undefined ? 0 : onSelectShip.heading,
            toggle: false,
            iconName: onSelectShip.speed < 2 ? 'shipInPort' : 'shipMarker'
        }
        
        const markerFeature = await handleFeature('Point', [coord[0], coord[1]], { ...ship });

        // ======= 항적 라인 레이어
        const lineFeatures = handleRouteLineFeatures(routeData);
        const lineLayer = await handleRouteLine('shipRoute', lineFeatures, routeLineStyle.layout, routeLineStyle.paint);
        
        // ======= 항적 라인 위 마커 레이어
        const lineMarkerFeatures = handleRouteMarkerFeatures(routeData);
        // const lineMarkerLayer = handleLayer('shipRouteMarker', 'circle', lineMarkerFeatures, {}, routeMarkerStyle.paint);
        const lineMarkerLayer = handleLayer('shipRouteMarker', 'symbol', lineMarkerFeatures, routeMarkerStyle.layout, {});

        return { lineLayer, lineFeatures, lineMarkerLayer, lineMarkerFeatures, markerFeature, depCoord };
    };
    
    /**
     * 항적을 그리기 위한 라인 features 생성
     * @param {array} routeData
     * @returns {array} Feature 객체
     */
    const handleRouteLineFeatures = (routeData) => {
        // 좌표 배열
        const coord = routeData.map((data) => {
            return [data.longitude, data.latitude];
        });
        
        // 경도 180, -180도 처리
        const newLon = handleLonChange(coord)[0];
        
        let geoLine = [];
        for (let i = 0; i < newLon.length - 1; i++) {
            const line = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [newLon[i][0], newLon[i][1]],
                            [newLon[i + 1][0], newLon[i + 1][1]],
                        ],
                    }
            };
            
            geoLine.push(line);
        }
        
        return geoLine;
    };
    
    /**
     * 항적 위 마커를 그리기 위한 라인 features 생성
     * @param {array} routeData
     * @returns {array} Feature 객체
     */
    const handleRouteMarkerFeatures = (routeData) => {
        // 좌표 배열
        const coord = routeData.map((data) => {
            return [data.longitude, data.latitude];
        });
        
        // 경도 180, -180도 처리
        const newLon = handleLonChange(coord)[0];
        
        let geoPoint = [];
        for (let i = 0; i < newLon.length; i++) {
            const point = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [newLon[i][0], newLon[i][1]],
                    },
                    properties: {
                        ...routeData[i],
                        iconName: 'shipRouteMarkerM'
                    }
            };
            
            geoPoint.push(point);
        }
        
        return geoPoint;
    };
    
    /**
     * 경도 180, -180도 처리
     * --
     * 경도 0을 기준으로 선박이 180도를 넘어가면 다음 좌표는 -180으로 처리되어야 함
     * @param {array} coord 선박 좌표 배열
     * @returns 
     */
    const handleLonChange = (coord) => {
        let check = 0;
        const newLon = [...coord];
        
        for (let i = 1; i < coord.length; i++) {
            // 이전 lon 값과 현재 lon 값의 부호가 다를때
            if ((newLon[i - 1][0] < 0 && newLon[i][0] > 0) || (newLon[i - 1][0] > 0 && newLon[i][0] < 0)) {
                //                       179   180   -179
                //                              |
                //                              |
                //  newLon[i-1].LON   ------------>   newLon[i].LON
                //                              |
                //                              |
                if (newLon[i - 1][0] > 90 && newLon[i - 1][0] <= 180 && newLon[i][0] >= -180 && newLon[i][0] < -90) {
                    newLon[i][0] = (180 + newLon[i][0]) + 180;
                }
                else if (newLon[i - 1][0] > 180) newLon[i][0] = (180 + newLon[i][0]) + 180;
                //                             180
                //                              |
                //                              |
                //  newLon[i].LON   <------------   newLon[i-1].LON
                //                              |
                //                              |
                else if (newLon[i - 1][0] >= -180 && newLon[i - 1][0] < -90 && newLon[i][0] > 90 && newLon[i][0] <= 180) {
                    for (let j = check; j < i; j++) {
                        if (newLon[j][0] < 0) newLon[j][0] = (180 + newLon[j][0]) + 180;
                    }
                    check = i;
                }
            }
        }
        
        return [newLon];
    };
    
    /**
	 * 경도 180, -180도 체크
	 * @param {array} routeData 항적 데이터
	 */
    const handleLonCheck = (routeData) => {
        let check = false;
        for (let i = 1; i < routeData.length; i++) {
            // routeData[0].LON < 0 && routeData[1].LON > 0 or
            // routeData[0].LON > 0 && routeData[1].LON < 0
            if ((routeData[i - 1].LON < 0 && routeData[i].LON > 0) ||
                (routeData[i - 1].LON > 0 && routeData[i].LON < 0)) {
                // routeData[0].LON > 90 && routeData[0].LON < 180 && routeData[1].LON > -180 && routeData[1].LON < -90 or
                // routeData[0].LON > -180 && routeData[0].LON < -90 && routeData[1].LON > 90 && routeData[1].LON < 180
                if ((routeData[i - 1].LON > 90 && routeData[i - 1].LON < 180 && routeData[i].LON > -180 && routeData[i] < -90) ||
                    (routeData[i - 1].LON > -180 && routeData[i - 1].LON < -90 && routeData[i].LON > 90 && routeData[i].LON < 180)) {
                    check = true;
                }
            }
        }
		
        return check;
    };
    
    // 위경도 표기 변환
	const handleCoord = (lat, lng) => {
		// lat = lat.toFixed()
		let latArr, lngArr, latTemp, lngTemp, d, m;
        
		if (lat > 0) {
			// latTemp = parseFloat(lat.toFixed(5));
			latTemp = parseFloat(lat);
			latTemp.toFixed(5);
            
			d = parseInt(latTemp);
			m = (latTemp - d) * 60;
			m = m.toFixed(3);

			latArr = [d, m, "N"];
		} else {
			latTemp = lat * -1;
			latTemp = parseFloat(latTemp.toFixed(5));
			latTemp = parseFloat(latTemp.toFixed(5));
			d = parseInt(latTemp);
			m = (latTemp - d) * 60;
			m = m.toFixed(3);

			latArr = [d, m, "S"];
		}
        
		if (lng > 0) {
			if (parseInt(lng / 180) % 2 === 0) {
				lngTemp = lng - parseInt(lng / 180) * 180;
				lngTemp = parseFloat(lngTemp.toFixed(5));

				d = parseInt(lngTemp);
				m = (lngTemp - d) * 60;
				m = m.toFixed(3);

				lngArr = [d, m, "E"];
			} else {
				lngTemp = (parseInt(lng / 180) * 180 - lng) * -1;
				lngTemp = parseFloat(lngTemp.toFixed(5));

				d = parseInt(lngTemp);
				m = (lngTemp - d) * 60;
				m = m.toFixed(3);

				lngArr = [d, m, "W"];
			}
		} else {
			if (parseInt(lng / 180) % 2 === 0) {
				lngTemp = (lng - parseInt(lng / 180) * 180) * -1;
				lngTemp = parseFloat(lngTemp.toFixed(5));

				d = parseInt(lngTemp);
				m = (lngTemp - d) * 60;
				m = m.toFixed(3);

				lngArr = [d, m, "W"];
			} else {
				lngTemp = parseInt(lng / 180) * 180 - lng;
				lngTemp = parseFloat(lngTemp.toFixed(5));

				d = parseInt(lngTemp);
				m = (lngTemp - d) * 60;
				m = m.toFixed(3);

				lngArr = [d, m, "E"];
			}
		}
		return [latArr, lngArr];
    };
    
    /**
     * 배출규제구역 레이어 생성
     */
    const handleEcaLayer = () => {
        // Layer Fill
        const fillLayer = {
            id: 'ecaAreaFill',
            type: 'fill',
            source: {
                'type': 'geojson',
                'data': ecaData
            },
            paint: {
                'fill-color': '#ff1a51',
                'fill-opacity': 0.2
            }
        };
        
        // Layer Line
        const lineSource = { ...ecaData };
        lineSource.features.map((feature, idx) => {
            feature.geometry.type = 'LineString';
            
            const coord = [...feature.geometry.coordinates[0]];
            feature.geometry.coordinates = [...coord];
        });
        
        const lineLayer = {
            id: 'ecaAreaLine',
            type: 'line',
            source: {
                'type': 'geojson',
                'data': lineSource
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#ff1a51',
                'line-width': 1
            }
        };        
        
        if (map.getLayer(fillLayer.id) === undefined) {
            map.addLayer(fillLayer, 'shipMarker');
            map.addLayer(lineLayer, 'shipMarker');
        }
    };
    
    /**
     * 항만구역 레이어 생성
     */
    const handleHarborLayer = () => {        
        // Layer Line
        const lineSource = { ...harborDataLine };
        // const lineSource = { ...harborData };
        lineSource.features.map((feature, idx) => {
            // feature.geometry.type = 'LineString';
            
            const coord = [...feature.geometry.coordinates[0]];
            
            // 울산항 표시선의 점선을 바깥쪽으로 세팅하기 위함
            if (feature.properties.name.includes('Ulsan')) {
                let reverseCoord = [];
                for (let i = coord.length - 1; i >= 0; i--) {
                    reverseCoord.push(coord[i]);
                }
                
                feature.geometry.coordinates = [...reverseCoord];
            } else {
                feature.geometry.coordinates = [...coord];
            }
        });
        
        const lineLayer = {
            id: 'harborAreaLine',
            type: 'line',
            source: {
                'type': 'geojson',
                'data': lineSource
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#ffff00',
                'line-opacity': 0.6,
                'line-width': 5,
            }
        };
        
        const dashLineLayer = {
            id: 'harborAreaDash',
            type: 'line',
            source: {
                'type': 'geojson',
                'data': lineSource
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
                'line-sort-key': 1
            },
            paint: {
                'line-color': 'rgb(0, 0, 0)',
                'line-width': 2,
                // 'line-translate': [0, -1.5],
                'line-offset': 1.5,
                'line-dasharray': [1 , 2]
            }
        };
        
        if (map.getLayer(lineLayer.id) === undefined) {
            map.addLayer(lineLayer, 'shipMarker');
            map.addLayer(dashLineLayer, 'shipMarker');
        }
    };
    
    /* MOUSE EVENT */
    // 선박 마커 클릭
    const shipMarkerClick = async (e) => {
        // 이미 선택한 선박이면 return
        if ((onSelectShip && onSelectShip.id === 0) && (e.features[0].properties.id === onSelectShip.id)) {
            return;
        } else {
            const data = { ...e.features[0].properties };
            
            // selectDate 변경시, API 요청할 때 mmsi가 필요하므로 Presenter에 선박 데이터 props 전달
            //  -> 추후 id로 변경
            onShipInfo({ ...data });
            shipMarkerRef.current = { id: data.id };
            
            // 선택한 선박으로 마커 feature 세팅
            // icon과 토글 prop은 data에 이미 존재함
            const feature = await handleFeature('Point', [data.longitude, data.latitude], { ...data });
        
            // shipMarker 레이어 소스를 선택한 선박 마커 소스로 변경
            // -> features value형태는 []여야 함
            map.getSource('shipMarker').setData({
                type: 'FeatureCollection',
                features: [
                    { ...feature }
                ]
            });
            
            setShipMarker(() => handleLayer('shipMarker', 'symbol', [feature], shipMarkerStyle.layout, shipMarkerStyle.paint));
            
            // 에러 아이콘 팝업
            errPopup.map((pop) => {
                pop.remove();
            });
            
            if (data.suspect) {
                errPopup = [];
                const popup = new window.mapboxgl.Popup({
                    offset: [-22, 8],
                    closeButton: false,
                    closeOnClick: false,
                }).setHTML('<img src=' + shipErrorImage + ' />').setLngLat([data.longitude, data.latitude]).addTo(map);
                errPopup.push(popup);
            } else {
                errPopup = [];
            }
            
            // 항적 레이어 삭제
            if ((onSelectDate.length <= 0 || onSelectDate === undefined) && map.getLayer('shipRoute') !== undefined) {                
                map.removeLayer('shipRoute');
                map.removeSource('shipRoute');
                
                map.removeLayer('shipRouteMarker');
                map.removeSource('shipRouteMarker');
                
                map.removeLayer('deptMarker');
                map.removeSource('deptMarker');
            }
            
            map.easeTo({
                center: [data.longitude, data.latitude],
                duration: 500
            });
        }        
    };
    
    // 선박 마커 마우스 오버 - 팝업 생성 함수
    const shipMarkerMouseover = (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        const shipName = e.features[0].properties.name;
        const shipType = e.features[0].properties.kind;
        const shipSpeed = e.features[0].properties.speed;
        const suspect = e.features[0].properties.suspect;
        
        let coord = [...e.features[0].geometry.coordinates];
        
        while (Math.abs(e.lngLat.lng - coord[0]) > 180) {
            coord[0] += e.lngLat.lng > coord[0] ? 360 : -360;
        }
        
        shipPopup
            .setLngLat(coord)
            .setHTML(
                `<div class="ship-popup-component">
                    ${ReactDOMServer.renderToString(
                        <Card title={shipName} extra={suspect && <ErrorIcon />} bordered={false} className="popup-header">
                            <Row gutter={24}>
                                <Col className="gutter-row popup-subject" span={8}>
                                    <p>선종</p>
                                    <p>선속</p>
                                </Col>
                                <Col className="gutter-row popup-content" span={16}>
                                    <p>{shipType}</p>
                                    <p>{shipSpeed} knot</p>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </div>`
            ).addTo(map);
    }
    
    // 선박 마커 마우스 아웃
    const shipMarkerMouseout = (e) => {
        map.getCanvas().style.cursor = '';
        
        shipPopup.remove();
    }
    
    // 항적 마커 마우스 오버 - 팝업 생성 함수
    const routeMarkerMouseover = (e) => {
        map.getCanvas().style.cursor = 'pointer';        
        
        const shipDate = e.features[0].properties.receiverTime.split('T');
        const shipRecDate = shipDate[0] + ' ' + shipDate[1].substr(0, 5);
        const shipSpeed = e.features[0].properties.speed;
        
        let coord = [...e.features[0].geometry.coordinates];
        
        const coordVal = handleCoord(parseFloat(coord[1]), parseFloat(coord[0]));
        const latVal = isNaN(coordVal[0][0]) ? '0' : coordVal[0][0] + '° ' + parseFloat(coordVal[0][1]) + '′ ' + coordVal[0][2];
        const lonVal = isNaN(coordVal[1][0]) ? '0' : coordVal[1][0] + '° ' + parseFloat(coordVal[1][1]) + '′ ' + coordVal[1][2];
        
        routePopup
            .setLngLat(coord)
            .setHTML(
                `<div class="ship-popup-component route-marker">
                    ${ReactDOMServer.renderToString(
                        <Card bordered={false} className="popup-header">
                            <Row gutter={24}>
                                <Col className="gutter-row popup-subject" span={10}>
                                    <p>수신데이터</p>
                                    <p>위도</p>
                                    <p>경도</p>
                                    <p>선속</p>
                                </Col>
                                <Col className="gutter-row popup-content" span={14}>
                                    <p>{shipRecDate}</p>
                                    <p>{latVal ? latVal : '0'}</p>
							        <p>{lonVal ? lonVal : '0'}</p>
                                    <p>{shipSpeed} knot</p>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </div>`
            ).addTo(map);
        
        map.off('mouseover', shipMarkerMouseover);
    }
    
    // 항적 마커 마우스 아웃
    const routeMarkerMouseout = (e) => {
        map.getCanvas().style.cursor = '';
        
        routePopup.remove();
    }
    
    // 마우스 이동에 따른 좌표 설정
    const mouseMoveOnMap = (e) => {
        const lat = e.lngLat.wrap().lat.toFixed(5);
        const lng = e.lngLat.wrap().lng.toFixed(5);
        
        // const coordVal = handleCoord(parseFloat(lat), parseFloat(lng));
        // const latVal = isNaN(coordVal[0][0]) ? '0' : coordVal[0][0] + '° ' + parseFloat(coordVal[0][1]) + '′ ' + coordVal[0][2];
        // const lngVal = isNaN(coordVal[1][0]) ? '0' : coordVal[1][0] + '° ' + parseFloat(coordVal[1][1]) + '′ ' + coordVal[1][2];
        
        setCoord([lat, lng]);
        // setCoord([latVal, lngVal]);
    }
    
    // remove 레이어 함수
    // const removeLayerOnMap = () => {
    //     if (map.getLayer('deptMarker') !== undefined) {
    //         map.removeLayer('deptMarker');
    //         map.removeSource('deptMarker');
    //     }
    // }
    
    /* HOOK */
	// Initialize map when component mounts
    useEffect(() => {
        map = new window.mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/lab021/ckm33o4r8am6a17o14gjt0w0h',
            zoom: 6.7,
            center: [128.09081, 35.76666],
            attributionControl: false,
            localIdeographFontFamily: 'Spoqa Sans Neo Medium, Noto Sans CJK KR , Roboto, Arial, sans-serif',
            localFontFamily: 'Spoqa Sans Neo Medium, Noto Sans CJK KR , Roboto, Arial, sans-serif',
            doubleClickZoom: false,
            crossSourceCollisions: false,
        });
        map.dragRotate.disable();

        // 마커 이미지 로드
        images.map((img) => {
            map.loadImage(img.file, (err, image) => {
                if (err) throw err;
                if (!map.hasImage(img.id)) map.addImage(img.id, image);
            });
        });
        
        /* MOUSE EVENTS */
        // 마우스 포인터 네비게이션
        map.on('mousemove', (e) => {
            mouseMoveOnMap(e);
        });
        
        // Clean up on unmount
        return () => {
            map.remove();
        }
    }, []);
    
    // 컴포넌트가 두번 렌더링되어 분리
    useEffect(() => {
        // if (map.loaded()) {
            if (onAllShipList.length &&
                ((!Object.keys(onSelectShip).length || onSelectShip.id === 0) || onSelectShip.id !== 0)) {                
                // allShipListRef.current = [...onAllShipList];
                
                if (map.getLayer('deptMarker') !== undefined) {
                    map.removeLayer('shipRoute');
                    map.removeSource('shipRoute');
                    
                    map.removeLayer('shipRouteMarker');
                    map.removeSource('shipRouteMarker');
                    
                    map.removeLayer('deptMarker');
                    map.removeSource('deptMarker');
                }
                
                handleShipMarkers();
                
                map.on('mouseover', 'shipMarker', shipMarkerMouseover);
                map.on('mouseout', 'shipMarker', shipMarkerMouseout);
                map.on('click', 'shipMarker', shipMarkerClick);
            } else if (!onAllShipList.length && (!Object.keys(onSelectShip).length || onSelectShip.id === 0)) {
                // allShipListRef.current = [];
                
                if (map.getLayer('deptMarker') !== undefined) {
                    map.removeLayer('shipRoute');
                    map.removeSource('shipRoute');
                    
                    map.removeLayer('shipRouteMarker');
                    map.removeSource('shipRouteMarker');
                    
                    map.removeLayer('deptMarker');
                    map.removeSource('deptMarker');
                }
                
                if (map.getLayer('shipMarker') !== undefined) {
                    map.removeLayer('shipMarker');
                    map.removeSource('shipMarker');
                }
                
                errPopup.map((pop) => {
                    pop.remove();
                });
                errPopup = [];
            } else {
                // allShipListRef.current = [];
                if (map.getLayer('deptMarker') !== undefined) {
                    map.removeLayer('shipRoute');
                    map.removeSource('shipRoute');
                    
                    map.removeLayer('shipRouteMarker');
                    map.removeSource('shipRouteMarker');
                    
                    map.removeLayer('deptMarker');
                    map.removeSource('deptMarker');
                }
                
                if (map.getLayer('shipMarker') !== undefined) {
                    map.removeLayer('shipMarker');
                    map.removeSource('shipMarker');
                }
                
                errPopup.map((pop) => {
                    pop.remove();
                });
                errPopup = [];
            }
        // }
        
        /* MOUSE EVENTS */
        // 마커 외 클릭
        map.on('click', (e) => {
            // 선박 마커, 항적 마커 클릭시, 맵 클릭 이벤트가 동시에 동작하는 것을 방지
            if ((map.queryRenderedFeatures(e.point).filter(feature => feature.source === 'shipMarker').length !== 0) ||
                (map.queryRenderedFeatures(e.point).filter(feature => feature.source === 'shipRouteMarker').length !== 0) ||
                (map.getLayer('shipMarker') === undefined || map.getSource('shipMarker').length === onAllShipList.length)) {
                return;
            } else {
                // 선택된 선박이 없고, 리스트로 마커를 출력한 상태
                // 마커 외 클릭 시 불필요한 마커 생성을 막기 위한 로직
                if (shipMarkerRef.current.id !== 0) {
                    onShipInfo({ id: 0 });
                    shipMarkerRef.current = { id: 0 };
                    
                    if (map.getLayer('shipRoute') !== undefined) {
                        map.removeLayer('shipRoute');
                        map.removeSource('shipRoute');
                        
                        map.removeLayer('shipRouteMarker');
                        map.removeSource('shipRouteMarker');
                        
                        map.removeLayer('deptMarker');
                        map.removeSource('deptMarker');
                    }
                }
                
                handleShipMarkers('mapClick');
                
                map.on('mouseover', 'shipMarker', shipMarkerMouseover);
                map.on('mouseout', 'shipMarker', shipMarkerMouseout);
                map.on('click', 'shipMarker', shipMarkerClick);
                
                map.off('mouseover', routeMarkerMouseover);
                map.off('mousemove', routeMarkerMouseover);
            }
        });
    }, [onAllShipList, onFilteredShipList]);
    
    // 헤더에서 선택한 선박 변경
    useEffect(async () => {
        if (onSelectShip && onSelectShip.id === 0) {
            return;
        } else {
            // 지도에서 이미 선택한 선박이면 return
            if ((onSelectShip && onSelectShip.id === 0) || shipMarkerRef.current.id === onSelectShip.id) {
                return;
            } else {
                // 선택한 선박으로 마커 feature 세팅
                // 선박 선택시 action에 properties는 전달되지 않으므로 iconName 재정의
                const ship = {
                    ...onSelectShip,
                    heading: onSelectShip.heading === undefined ? 0 : onSelectShip.heading,
                    toggle: false,
                    iconName: onSelectShip.speed < 2 ? 'shipInPort' : 'shipMarker'
                }
                
                shipMarkerRef.current = { id: ship.id };
                
                const feature = await handleFeature('Point', [ship.longitude, ship.latitude], { ...ship });
                
                // shipMarker 레이어 소스를 선택한 선박 마커 소스로 변경
                // -> features value형태는 []여야 함
                if (map.getSource('shipMarker') !== undefined) {
                    map.getSource('shipMarker').setData({
                        type: 'FeatureCollection',
                        features: [
                            { ...feature }
                        ]
                    });                    
                } else {
                    const marker = handleLayer('shipMarker', 'symbol', [{ ...feature }], shipMarkerStyle.layout, shipMarkerStyle.paint);
                    map.addLayer(marker);
                }
                
                setShipMarker(() => handleLayer('shipMarker', 'symbol', [{...feature}], shipMarkerStyle.layout, shipMarkerStyle.paint));
                
                // 에러 아이콘 팝업
                errPopup.map((pop) => {
                    pop.remove();
                });
                
                if (ship.suspect) {
                    errPopup = [];
                    const popup = new window.mapboxgl.Popup({
                        offset: [-22, 8],
                        closeButton: false,
                        closeOnClick: false,
                    }).setHTML('<img src=' + shipErrorImage + ' />').setLngLat([ship.longitude, ship.latitude]).addTo(map);
                    errPopup.push(popup);
                } else {
                    errPopup = [];
                }
                
                // 항적 레이어 삭제
                if (map.getLayer('shipRoute') !== undefined) {
                    map.removeLayer('shipRoute');
                    map.removeSource('shipRoute');
                    
                    map.removeLayer('shipRouteMarker');
                    map.removeSource('shipRouteMarker');
                    
                    map.removeLayer('deptMarker');
                    map.removeSource('deptMarker');
                }
                
                map.easeTo({
                    center: [ship.longitude, ship.latitude],
                    duration: 500
                });
            }
        }
    }, [onSelectShip]);
    
    // 과거 항적 날짜 범위 선택 후 '선택' 버튼 클릭 -> API -> onShipRoute
    useEffect(async () => {
        if ((!onSelectDate.length || onSelectDate === undefined) && !onShipRoute.length) {
            return;
        } else if (!onShipRoute.length) {
            if (map.getLayer('shipRoute') !== undefined) {
                map.removeLayer('shipRoute');
                map.removeSource('shipRoute');
                
                map.removeLayer('shipRouteMarker');
                map.removeSource('shipRouteMarker');
                
                map.removeLayer('deptMarker');
                map.removeSource('deptMarker');
            }
        } else {
            handleShipRoute(onShipRoute).then((res) => {
                // handleLayer 함수 실행시 데이터 형식이 맞지 않아 features에 할당되지 않으므로 array로 감싸고 구조분해할당함
                const markerFeature = [{ ...res.markerFeature }];
                
                // 항적 레이어 최초 생성
                if (res.lineLayer.source.data.features.length && map.getLayer('shipRoute') === undefined) {
                    // 항적 및 항적 마커 레이어
                    if (res.lineMarkerLayer.source.data.features.length && map.getLayer('shipRouteMarker') === undefined) {
                        map.addLayer(res.lineLayer);
                        map.addLayer(res.lineMarkerLayer);
                    }
                    
                    // 선박 마커 레이어
                    // 항적 위에 선박을 나타내기 위해 지우고 다시 생성
                    if (map.getLayer('shipMarker') !== undefined) {
                        map.removeLayer('shipMarker');
                        map.removeSource('shipMarker');
                        
                        // 선박 마커 생성
                        handleShipMarker('shipMarker', markerFeature).then((shipMarkerLayer) => {
                            if (shipMarkerLayer.id) {
                                setShipMarker(shipMarkerLayer);
                                
                                if (map.getLayer(shipMarkerLayer.id) === undefined) {
                                    map.addLayer(shipMarkerLayer);
                                } else {
                                    map.getSource(shipMarkerLayer.id).setData({
                                        type: 'FeatureCollection',
                                        features: markerFeature
                                    });
                                }
                                
                                errPopup.map((pop) => {
                                    pop.remove();
                                });
                                errPopup = [];
                                
                                // 의심 선박 에러 아이콘 출력
                                shipMarkerLayer.source.data.features.map((feature) => {
                                    if (feature.properties.suspect) {
                                        const popup = new window.mapboxgl.Popup({
                                            offset: [-22, 8],
                                            closeButton: false,
                                            closeOnClick: false,
                                        }).setHTML('<img src=' + shipErrorImage + ' />').setLngLat(feature.geometry.coordinates).addTo(map);
                                        
                                        errPopup = [...errPopup, popup];
                                    }
                                });
                            }
                        }).catch((err) => {
                            // console.log('err', err);
                        });
                    }                    
                } else if (res.lineLayer.source.data.features.length && map.getLayer('shipRoute') !== undefined) {
                    // 항적 레이어 소스 변경
                    map.getSource('shipRoute').setData({
                        type: 'FeatureCollection',
                        features: res.lineFeatures
                    });
                    
                    // 항적 위 마커 레이어 소스 변경
                    map.getSource('shipRouteMarker').setData({
                        type: 'FeatureCollection',
                        features: res.lineMarkerFeatures
                    });
                    
                    // 선박 마커 레이어 소스 변경
                    map.getSource('shipMarker').setData({
                        type: 'FeatureCollection',
                        features: markerFeature
                    });
                    
                    shipMarkerRef.current = { id: res.markerFeature.properties.id };
                }
                
                setShipMarker(() => handleLayer('shipMarker', 'symbol', markerFeature, shipMarkerStyle.layout, shipMarkerStyle.paint));
                
                // 출발 마커 생성
                if (res.depCoord.length) {
                    const deptLayout = {
                        'symbol-placement': 'point',
                        'icon-image': ['get', 'iconName'],
                        'icon-size': 1,
                        'icon-pitch-alignment': 'viewport',
                        'icon-ignore-placement': true,
                        'icon-allow-overlap': true,
                        'icon-offset': [0, -20]
                    }
                    
                    const deptFeature =  [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": res.depCoord
                            },
                            "properties": {
                                "iconName": "shipDept"
                            }
                        }];
                    
                    if (map.getLayer('deptMarker') === undefined) {
                        const deptMarker = handleLayer('deptMarker', 'symbol', deptFeature, deptLayout, {});
                        map.addLayer(deptMarker);
                    } else {
                        map.getSource('deptMarker').setData({
                            type: 'FeatureCollection',
                            features: deptFeature
                        });
                    }
                } else {
                    if (map.getLayer('deptMarker') !== undefined) {
                        map.removeLayer('deptMarker');
                        map.removeSource('deptMarker');
                    }
                }
                
                // 에러 아이콘 팝업
                errPopup.map((pop) => {
                    pop.remove();
                });
                
                if (markerFeature[0].properties.suspect) {
                    errPopup = [];
                    const popup = new window.mapboxgl.Popup({
                        offset: [-22, 8],
                        closeButton: false,
                        closeOnClick: false,
                    }).setHTML('<img src=' + shipErrorImage + ' />')
                        .setLngLat(markerFeature[0].geometry.coordinates)
                        .addTo(map);
                    
                    errPopup.push(popup);
                } else {
                    errPopup = [];
                }
                
                map.off('click', shipMarkerClick);
                map.on('mouseover', 'shipRouteMarker', routeMarkerMouseover);
                map.on('mousemove', 'shipRouteMarker', routeMarkerMouseover);
                map.on('mouseout', 'shipRouteMarker', routeMarkerMouseout);
                
                map.easeTo({
                    center: markerFeature[0].geometry.coordinates,
                    duration: 500
                });
            }).catch((err) => {
                // console.log('err', err);
            });
        }
    }, [onShipRoute]);
    
    // 배출 규제 구역 표시 토글
    useEffect(() => {
        if (ecaToggle) {
            if (map.getLayer('ecaAreaFill') !== undefined) {
                map.setLayoutProperty('ecaAreaFill', 'visibility', 'visible');
                map.setLayoutProperty('ecaAreaLine', 'visibility', 'visible');
            } else {
                handleEcaLayer();
            }
        } else {
            if (map.getLayer('ecaAreaFill') !== undefined) {
                map.setLayoutProperty('ecaAreaFill', 'visibility', 'none');
                map.setLayoutProperty('ecaAreaLine', 'visibility', 'none');
            }
        }
    }, [ecaToggle]);
    
    // 항만 구역 표시 토글
    useEffect(() => {
        if (harborToggle) {
            if (map.getLayer('harborAreaLine') !== undefined) {
                map.setLayoutProperty('harborAreaLine', 'visibility', 'visible');
                map.setLayoutProperty('harborAreaDash', 'visibility', 'visible');
            } else {
                handleHarborLayer();
            }
        } else {
            if (map.getLayer('harborAreaLine') !== undefined) {
                map.setLayoutProperty('harborAreaLine', 'visibility', 'none');
                map.setLayoutProperty('harborAreaDash', 'visibility', 'none');
            }
        }
    }, [harborToggle]);
    
    /* RENDER */
    return (
        <React.Fragment>
            <MapToggle
                coord={coord}
                onHarborToggle={setHarborToggle}
                onECAToggle={setECAToggle}
            />
            
            <div className="map-container" ref={mapContainerRef}></div>
        </React.Fragment>
    );
};

export default Map;