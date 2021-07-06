import React, { useEffect, useState } from 'react';
import { vesselParticular } from '../templates';
import FormBoard from 'components/dataDisplay/FormBoard';
import Form from 'antd/lib/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { ParticularAPI } from 'api';
import { setVesselParticularInfosFacadeAction } from 'redux/reducer/actionCreator';
import shipForms from '../forms/shipForms';
import { getObjectSize } from 'utils/esManager';
import { message } from 'antd';

const VesselParticular = ({ particularForm, selectVessel }) => {
  /* States */
  const particular = useSelector((state) => state.vessel.particular.sh, true);
  const [mmsiVisible, setMmsiVisible] = useState();
  const dispatch = useDispatch();
  const { shipId } = selectVessel;

  /* Hooks */
  useEffect(() => {
    setFormDefaultValue();
    return () => {};
  }, [particular]);

  const setFormDefaultValue = () => {
    const newVesselForm = {
      ...particular.basic,
      ...particular.particular,
    };

    particularForm.setFieldsValue(newVesselForm);

    setMmsiVisible(!newVesselForm.isAIS);
  };

  /* Functions */
  const refreshParticulars = () => {
    //FIXME 저장 성공알림 추가
    let vesselParticular = ParticularAPI.getVesselParticular(shipId);
    let engineParticular = ParticularAPI.getEngineParticular(shipId);

    Promise.all([vesselParticular, engineParticular])
      .then((res) => {
        setVesselParticularInfosFacadeAction(dispatch, [
          res[0].rows,
          res[1].rows,
        ]);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  const handleFinishForm = (value) => {
    const body = shipForms.parseBodyForm(value);

    if (particular.basic.shipInfoId === 0) {
      ParticularAPI.insertVesselParticular(shipId, body).then((res) => {
        if (res) {
          refreshParticulars();
          message.success('저장 성공!');
        } else {
          message.error('저장에 실패했습니다.');
        }
      });
    } else {
      ParticularAPI.updateVesselParticular(
        shipId,
        particular.basic.shipInfoId,
        body
      ).then((res) => {
        if (res) {
          refreshParticulars();
          message.success('저장 성공!');
        } else {
          message.error('저장에 실패했습니다.');
        }
      });
    }
  };

  return (
    <>
      <Form
        form={particularForm}
        onValuesChange={(changeValues, allValues) => {
          if (getObjectSize(changeValues) > 1) return;
          else {
            const key = Object.keys(changeValues)[0];
            const value = changeValues[key];

            // if (key === 'typeAIS') {
            //   // FIXME AIS 설치, 미설치, 도선으로 바뀌면 조건식 변경
            //   const newMmsiState = !(value === 'ais');
            //   console.log('newMmsiState: ', newMmsiState);
            //   setMmsiVisible(newMmsiState);
            // }

            if (key === 'isAIS') {
              setMmsiVisible(!value);
            }
          }
        }}
        onFinish={handleFinishForm}
        onFinishFailed={handleFinishForm}
      >
        <div className="vessel-particular-container">
          <div className="content-box particular-box">
            <div className="left-page page">
              <div className="page-header">기본 정보</div>
              <div className="page-content">
                <FormBoard
                  id={'BASIC INFO'}
                  key={`${shipId}BASICFORM`}
                  particularForm={particularForm}
                  defaultValue={particular.basic}
                  template={[
                    {
                      fill: true,
                      cols: [{ data: vesselParticular.vesselName }],
                    },
                    {
                      cols: [
                        { data: vesselParticular.vesselType },
                        { data: vesselParticular.vesselTypeSub },
                      ],
                    },
                    {
                      cols: [
                        { data: vesselParticular.vesselNumber },
                        { data: vesselParticular.manageNumber },
                      ],
                    },
                    {
                      cols: [{ data: vesselParticular.usableAIS }, {}],
                    },
                    {
                      cols: [
                        { data: vesselParticular.fairWay_1 },
                        { data: vesselParticular.fairWay_2 },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
            <div className="right-page page">
              <div className="page-header">제원 정보</div>
              <div className="page-content">
                <FormBoard
                  id={'PARTICULAR INFO'}
                  key={`${shipId}PATRICULARFORM`}
                  particularForm={particularForm}
                  defaultValue={particular.particular}
                  template={[
                    {
                      cols: [
                        { data: vesselParticular.length },
                        { data: vesselParticular.width },
                        { data: vesselParticular.depth },
                      ],
                    },
                    {
                      cols: [{ data: vesselParticular.grossTonnage }, {}],
                    },
                    {
                      cols: [
                        { data: vesselParticular.speedAverage },
                        { data: vesselParticular.speedMaximum },
                      ],
                    },
                    {
                      cols: [
                        {
                          data: vesselParticular.mmsi,
                          attr: {
                            disabled: mmsiVisible,
                          },
                        },
                        {
                          data: vesselParticular.mmsiStart,
                          attr: {
                            disabled: mmsiVisible,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default React.memo(VesselParticular, (prev, next) => {
  return prev.selectVessel.shipId === next.selectVessel.shipId;
});
