import React, { useEffect, useState } from 'react';

// Ant Design
import Icon from '@ant-design/icons';
import { Row, Col, Switch } from 'antd';

// 아이콘 커스텀
const pinSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="11.598" height="14" viewBox="0 0 11.598 14">
		<path id="패스_2043" data-name="패스 2043" d="M26.518,11.4a5.8,5.8,0,1,0-8.2,8.2l4.1,4.1,4.1-4.1A5.8,5.8,0,0,0,26.518,11.4Zm-4.1,7.079a3.018,3.018,0,1,1,3.017-3.017A3.018,3.018,0,0,1,22.417,18.483Z" transform="translate(-16.618 -9.705)" fill="#fff"/>
	</svg>
);
const minusSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
		<g id="그룹_1939" data-name="그룹 1939" transform="translate(-6.95 -6.95)">
			<path id="패스_2044" data-name="패스 2044" d="M18.845,10.361,15.539,7.055a.359.359,0,0,0-.254-.105H10.615a.359.359,0,0,0-.254.105L7.055,10.361a.359.359,0,0,0-.105.254v4.671a.359.359,0,0,0,.105.254l3.305,3.305a.359.359,0,0,0,.254.105h4.671a.359.359,0,0,0,.254-.105l3.305-3.305a.359.359,0,0,0,.105-.254V10.615a.359.359,0,0,0-.105-.254Zm-2.232,3.447a.24.24,0,0,1-.24.24H9.527a.24.24,0,0,1-.24-.24V12.093a.24.24,0,0,1,.24-.24h6.846a.24.24,0,0,1,.24.24Z" transform="translate(0 0)" fill="#fff"/>
		</g>
	</svg>
);
const harborSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12.48" viewBox="0 0 12 12.48">
		<g id="그룹_1969" data-name="그룹 1969" transform="translate(-1687 -152.76)">
			<path id="패스_2056" data-name="패스 2056" d="M64.874,184.1a9.526,9.526,0,0,1-5.766,0,5.887,5.887,0,0,1-1.869,1.085.06.06,0,0,0,.027.117,12.592,12.592,0,0,0,1.842-.36,9.645,9.645,0,0,0,2.883.417,8.579,8.579,0,0,0,2.883-.417,11.873,11.873,0,0,0,1.86.363.06.06,0,0,0,.027-.117A6.387,6.387,0,0,1,64.874,184.1Zm2.811-4.767L62.1,176.772a.236.236,0,0,0-.2,0l-5.583,2.563a.542.542,0,0,0-.315.492.557.557,0,0,0,.039.2L57.68,184.1a3.416,3.416,0,0,0,1.7-.66A7.262,7.262,0,0,0,61.76,184c.084.006.165.006.24.006s.156,0,.24-.006a7.188,7.188,0,0,0,2.379-.558,3.416,3.416,0,0,0,1.7.66l1.641-4.074a.557.557,0,0,0,.039-.2A.542.542,0,0,0,67.685,179.336Zm-7,.75c-.2,0-.36-.294-.36-.66s.162-.66.36-.66.36.294.36.66S60.878,180.085,60.68,180.085Zm2.64,0c-.2,0-.36-.294-.36-.66s.162-.66.36-.66.36.294.36.66S63.518,180.085,63.32,180.085Z" transform="translate(1631 -20.122)" fill="#fff"/>
			<path id="패스_2057" data-name="패스 2057" d="M110.622,50.373v0c-.168-.8-.525-1.409-1.2-1.409h-1.038l-.06-.24A.96.96,0,0,0,107.4,48h-1.709a.959.959,0,0,0-.93.724l-.06.237h-1.032c-.687,0-1.053.622-1.194,1.412l-.546,2.908a.12.12,0,0,0,.168.132l.759-.348a.121.121,0,0,0,.069-.087l.486-2.572c.075-.321.219-.481.483-.481H109.2c.267,0,.393.15.483.481l.486,2.572a.114.114,0,0,0,.069.087l.762.351a.12.12,0,0,0,.168-.132Z" transform="translate(1586.453 104.76)" fill="#fff"/>
		</g>
	</svg>
);
const PinIcon = props => <Icon component={pinSvg} {...props} />;
const MinusIcon = props => <Icon component={minusSvg} {...props} />;
const HarborIcon = props => <Icon component={harborSvg} {...props} />;

const MapToggle = (props) => {
    const {
		coord,
		onECAToggle,
		onHarborToggle
	} = props;
	
	/* STATE */
	const [exprCoord, setExprCoord] = useState([0, 0]);
	
	/* FUNCTIONS */
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
	
	/* HOOK */
	useEffect(() => {
		const coordVal = handleCoord(parseFloat(coord[0]), parseFloat(coord[1]));
        const latVal = isNaN(coordVal[0][0]) ? '0' : coordVal[0][0] + '° ' + parseFloat(coordVal[0][1]) + '′ ' + coordVal[0][2];
		const lngVal = isNaN(coordVal[1][0]) ? '0' : coordVal[1][0] + '° ' + parseFloat(coordVal[1][1]) + '′ ' + coordVal[1][2];
		
		setExprCoord([latVal, lngVal]);
	}, [coord]);

    return (
		<div className="map-component toggle-component">
            <Row align="middle" className="toggle-wrapper">
				<Col flex="30px" className="toggle-icon"><PinIcon /></Col>
				
                <Col flex="1px" className="toggle-divider"></Col>
                
				<Col span={10}>{exprCoord[0]}</Col>
				
				<Col flex="1px" className="toggle-divider"></Col>
				
                <Col span={10}>{exprCoord[1]}</Col>
            </Row>
            <Row align="middle" className="toggle-wrapper toggle-area">
				<Col flex="30px" className="toggle-icon"><MinusIcon /></Col>
				
                <Col flex="1px" className="toggle-divider"></Col>
                
                <Col span={10} className="toggle-title">배출 규제 구역</Col>
				<Col offset={7}><Switch size="small" onChange={(checked) => onECAToggle(checked)} /></Col>
            </Row>
            <Row align="middle" className="toggle-wrapper toggle-area">
				<Col flex="30px" className="toggle-icon"><HarborIcon /></Col>
				
                <Col flex="1px" className="toggle-divider"></Col>
                
                <Col span={10} className="toggle-title">항만 구역</Col>
				<Col offset={7}><Switch size="small" onChange={(checked) => onHarborToggle(checked)} /></Col>
            </Row>
        </div>
    )
};

export default MapToggle;