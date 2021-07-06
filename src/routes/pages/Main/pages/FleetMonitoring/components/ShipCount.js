import React from 'react';

// Ant design layout
import { Row, Col } from 'antd';

const ShipCount = (props) => {
    const {
        shipCount
    } = props;
    
    return (
        <div className="map-component ship-count-component">
            <Row gutter={8}>
                <Col>
                    <div className="count-box rounded-shadow-md active">
                        <h4 className="count-title">전체</h4>
                        <Row justify="space-between" align="bottom" className="">
                            <p className="count-total">{shipCount.totalShip ? shipCount.totalShip : 0}</p>
                            <span className="count-danger red-6">/{shipCount.suspectTotalShip ? shipCount.suspectTotalShip : 0}</span>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="count-box rounded-shadow-md">
                        <h4 className="count-title">여객선</h4>
                        <Row justify="space-between" align="bottom" className="">
                            <p className="count-total">{shipCount.totalFerryShip ? shipCount.totalFerryShip : 0}</p>
                            <span className="count-danger">/{shipCount.suspectFerryShip ? shipCount.suspectFerryShip : 0}</span>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="count-box rounded-shadow-md">
                        <h4 className="count-title">화물선</h4>
                        <Row justify="space-between" align="bottom" className="">
                            <p className="count-total">{shipCount.totalCargoShip ? shipCount.totalCargoShip : 0}</p>
                            <span className="count-danger">/{shipCount.suspectCargoShip ? shipCount.suspectCargoShip : 0}</span>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="count-box rounded-shadow-md">
                        <h4 className="count-title">기타</h4>
                        <Row justify="space-between" align="bottom" className="">
                            <p className="count-total">{shipCount.totalOtherShip ? shipCount.totalOtherShip : 0}</p>
                            <span className="count-danger">/{shipCount.suspectOtherShip ? shipCount.suspectOtherShip : 0}</span>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
};

// 불필요한 리렌더링 방지
const equalComparison = (prevProps, nextProps) => {
	return prevProps.shipCount.totalShip === nextProps.shipCount.totalShip;
};
  
export default React.memo(ShipCount, equalComparison);