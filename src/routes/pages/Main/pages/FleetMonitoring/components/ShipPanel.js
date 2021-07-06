import React, { useEffect, useState } from 'react';

import Moment from 'moment';

// Ant design layout
import Icon from '@ant-design/icons';
import { CaretRightOutlined } from '@ant-design/icons';
import { Row, Col, Card, Button, DatePicker, Modal, Image, message } from 'antd';



// Date Picker Seporator Icon
import pickerSeporator from 'assets/images/icon_calendar_arrow.png';

const ShipPanel = (props) => {
	const {
		onSelectShip,
		onSelectDate,
		onShipRoute,
		onRouteLoading
	} = props;
	
	/* STATE */
	// 선택한 날짜 범위
	const [selectDate, setSelectDate] = useState([]);	
	// 선택한 날짜 표기 박스
	const [dateToggle, setDateToggle] = useState();	
	// Date Picker Modal Toggle
	const [modalToggle, setModalToggle] = useState();	
	// Alert
	const [messageAPI, contextHolder] = message.useMessage();
	
	/* FUNCTIONS */
	// 좌표 방위 표시
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
    
    const coordVal = handleCoord(parseFloat(onSelectShip.latitude), parseFloat(onSelectShip.longitude));
    const lat = isNaN(coordVal[0][0]) ? '0' : coordVal[0][0] + '° ' + parseFloat(coordVal[0][1]) + '′ ' + coordVal[0][2];
	const lon = isNaN(coordVal[1][0]) ? '0' : coordVal[1][0] + '° ' + parseFloat(coordVal[1][1]) + '′ ' + coordVal[1][2];
	
	// 아이콘 커스텀
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
	
	// Date Picker 설정
	const { RangePicker } = DatePicker;
	// const today = Moment().format('YYYY-MM-DD HH:mm');
	const pickerFormat = 'YYYY-MM-DD HH:mm';
	Moment.updateLocale('en', {
		week: { dow: 0 },
		weekdaysMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
	});
	
	// message 컴포넌트에 작성될 context
	const Context = React.createContext({ recDate: onSelectShip.recDate });
	
	// 알림 출력 함수
	const handleWarningMsg = (type, content) => {		
		messageAPI.warning({
			type,
			content,
			className: 'alert-wrap',
			duration: 1.5,
			style: {
				marginTop: '20vh'
			}
		})			
	};

	// 날짜 범위 선택 유효성 체크
	const handleDateRangeRender = (date) => {
		if (!date.length || date === undefined) {
			handleWarningMsg('', '날짜를 선택하세요.');
		} else {
			onSelectDate(date);
			setDateToggle(true);
			
			// fix: shipRouteData에 같이 싣는 게 나을듯
			// onRouteLoading && message.loading('test', 1.5);
		}
	};
	
	/* HOOK */
	useEffect(() => {
		setDateToggle(false);
		setModalToggle(false);
	}, []);
	
	// 다른 선박 선택시
	useEffect(() => {
		setSelectDate([]);
		setDateToggle(false);
	}, [onSelectShip]);
	
	// 항적 데이터
	useEffect(() => {
		if (selectDate.length && onShipRoute.length) {
			setDateToggle(true);
			setModalToggle(false);
		} else if (selectDate.length && !onShipRoute.length) {
			const context = <Context.Consumer>{({ recDate }) => `해당 날짜의 항적 데이터가 존재하지 않습니다. 최신 데이터: ${recDate}`}</Context.Consumer>;
			handleWarningMsg('info', context);
			setSelectDate([]);
			setDateToggle(false);
		}
	}, [onShipRoute]);
	
	/* RENDER */
	return (
		<div className="map-component ship-info-component">
			<div className="info-wrapper rounded-shadow-sm">
				<Context.Provider value={{ date: onSelectShip.recDate }}>
					{contextHolder}
				</Context.Provider>
				
				{/* 의심 선박인 경우 출력(+title.extra) */}
				{ onSelectShip.suspect && <div className="error-line"></div> }
				
				<Card title={onSelectShip.name ? onSelectShip.name : '-'} extra={ onSelectShip.suspect && <ErrorIcon /> } bordered={false} className="info-box">
					<Row gutter={24}>
						<Col className="gutter-row info-subject" span={10}>
							<p>MMSI</p>
							<p>최신데이터</p>
							<p>선종</p>
							<p>위도</p>
							<p>경도</p>
							<p>선속</p>
						</Col>
						<Col className="gutter-row info-content" span={14}>
							<p>{onSelectShip.mmsi ? onSelectShip.mmsi : '-'}</p>
							<p>{onSelectShip.recDate ? onSelectShip.recDate : '-'}</p>
							<p>{onSelectShip.kind ? onSelectShip.kind : '-'}</p>
							<p>{lat ? lat : '0'}</p>
							<p>{lon ? lon : '0'}</p>
							<p>{onSelectShip.speed ? onSelectShip.speed : '0'} knot</p>
						</Col>
					</Row>
				</Card>
			</div>
			
			{ dateToggle &&
				<div className="date-wrapper">
					<Row justify="space-around" align="middle">
						<Col flex={3}>{selectDate[0]}</Col>
						<Col flex={3}><CaretRightOutlined /></Col>
						<Col flex={3}>{selectDate[1]}</Col>
					</Row>
				</div>
			}
			
			<Button type="primary" block className="btn btn-primary rounded-shadow-sm" onClick={() => setModalToggle(true)}>과거 항적 검색</Button>

			{/* 과거 항적 검색 버튼 클릭시 출력 */}
			<Modal
				title="과거 항적 검색"
				centered
				visible={modalToggle}
				onOk={() => handleDateRangeRender(selectDate)}
				onCancel={() => setModalToggle(false)}
				closable={false}
				wrapClassName="date-picker-modal"
			>
				<RangePicker
					transitionName=""
					showTime={{ format: 'HH:mm' }}
					format={pickerFormat}
					getPopupContainer={((trigger) => trigger.parentNode)}
					onChange={(date, dateStr) => setSelectDate([dateStr[0], dateStr[1]])}
					separator={<Image src={pickerSeporator} preview={false} />}
					placeholder={['시작 날짜', '종료 날짜']}
					allowClear={false}
					defaultPickerValue={[Moment, Moment]}
					value={selectDate.length ? [Moment(selectDate[0]), Moment(selectDate[1])] : ''}
				>
				</RangePicker>
			</Modal>
		</div>
	);
};

export default ShipPanel;