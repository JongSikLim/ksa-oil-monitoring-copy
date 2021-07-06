import { Form, message } from 'antd';
import { EngineAPI, ParticularAPI } from 'api';
import FormBoard from 'components/dataDisplay/FormBoard';
import React, { useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import actionsCreator from 'redux/reducer/actionCreator';
import { adjustPrecision, getObjectSize } from 'utils/esManager';
import engineForms from '../forms/engineForms';
import { engineParticular, engineUnits } from '../templates';
const { vesselActions } = actionsCreator;

const EngineParticular = ({ particularForm, selectVessel }) => {
  /* State */
  const dispatch = useDispatch();
  const { typeAIS } = useSelector((state) => state.vessel.selectParticular);
  const particular = useSelector((state) => state.vessel.particular.en);
  const isFerry = typeAIS === 'pilot' ? true : false;
  const { shipId } = selectVessel;

  /* Hooks */
  useEffect(() => {
    setFormDefaultValue();
    return () => {};
  }, [particular]);

  useEffect(() => {
    getEngineParticular();
    return () => {};
  }, []);

  /* Functions */

  /**
   * @title Form 데이터 초기화
   * @description
   */
  const setFormDefaultValue = () => {
    particularForm.setFieldsValue(particular);
  };

  /**
   * @title FORM BOARD 용 TEMPLATE 반환
   * @description 현재 선박의 도선여부를 기준으로 템플릿 반환
   * @return Success => [leftPanelTemplate, rightPanelTemplate]
   */
  const setTemplates = () => {
    let leftPanelTemplate, rightPanelTemplate;

    if (!isFerry) {
      leftPanelTemplate = [
        {
          cols: [
            {
              data: engineParticular.mainEngineCompany,
            },
            {
              data: engineParticular.mainEngineModel,
            },
          ],
        },
        {
          cols: [
            { data: engineParticular.mainEngineLoad },
            { data: engineParticular.speedAverage },
            { data: engineParticular.speedMaximum },
          ],
        },
        {
          cols: [
            {
              data: engineParticular.mainEnginePower,
            },
            {
              data: engineParticular.mainEngineUnit,
            },
            {
              data: engineParticular.mainEngineAmount,
            },
            { data: engineParticular.mainEngineOutput },
          ],
        },
        {
          cols: [{ data: engineParticular.consumption }],
        },
      ];

      rightPanelTemplate = [
        {
          cols: [
            {
              data: engineParticular.subEngineCompany,
            },
            {
              data: engineParticular.subEngineModel,
            },
          ],
        },
        {
          cols: [
            {
              data: engineParticular.subEnginePower,
            },
            {
              data: engineParticular.subEngineUnit,
            },
            {
              data: engineParticular.subEngineAmount,
            },
            { data: engineParticular.subEngineOutput },
          ],
        },
        {
          cols: [{ data: engineParticular.subConsumption }],
        },
      ];
    } else {
      leftPanelTemplate = [
        {
          cols: [
            //FIXME 엔진리스트 추가
            {
              data: engineParticular.voyageMainEngineFuel,
            },
            {},
          ],
        },
      ];
      rightPanelTemplate = [
        {
          cols: [
            //FIXME 엔진리스트 추가
            {
              data: engineParticular.voyageSubEngineFuel,
            },
            {},
          ],
        },
      ];
    }

    return [leftPanelTemplate, rightPanelTemplate];
  };

  /**
   * @title 엔진 제원 api GET 요청
   * @description 선박이 변경될 때, 저장완료되었을 때 해당 선박의 엔진 제원 값을 다시불러온다.
   */
  const getEngineParticular = () => {
    ParticularAPI.getEngineParticular(shipId).then((res) => {
      dispatch(vesselActions.setEn(res.rows));
    });
  };

  /**
   * @title formboard 저장 처리
   * @description 저장버튼을 클릭했을 때, 값을 받아서 Form 파싱 후 POST, PUT API 요청
   * @param value FORM 데이터
   */
  const handleFinishForm = (value) => {
    const { shipEngineId } = particular;
    let body = {};

    if (isFerry) {
      body = engineForms.parseFerryBodyForm(value);
    } else {
      body = engineForms.parseBodyForm(value);
    }

    if (shipEngineId === 0) {
      ParticularAPI.insertEngineParticular(shipId, body).then((res) => {
        if (res) {
          getEngineParticular();
          message.success('저장 완료!');
        } else {
          message.error('저장에 실패했습니다.');
        }
      });
    } else {
      ParticularAPI.updateEngineParticular(shipId, shipEngineId, body).then(
        (res) => {
          if (res) {
            getEngineParticular();
            message.success('저장 완료!');
          } else {
            message.error('저장에 실패했습니다.');
          }
        }
      );
    }
  };

  /**
   * @title form 값 변경 핸들러
   * @description 엔진 출력관련 값들 변경 시 자동 계산 처리
   */
  const handleFormChangeValue = (changeValues, allValues) => {
    const key = Object.keys(changeValues)[0];

    // 주엔진 최대출력 계산
    if (
      ['mainEnginePower', 'mainEngineUnit', 'mainEngineAmount'].includes(key)
    ) {
      const { mainEnginePower, mainEngineUnit, mainEngineAmount } = allValues;
      const mainEngineOutput = adjustPrecision(
        mainEnginePower * mainEngineAmount * engineUnits[mainEngineUnit]
      );

      particularForm.setFieldsValue({ ...allValues, mainEngineOutput });
    }
    // 보조엔진 최대출력 계산
    else if (
      ['subEnginePower', 'subEngineUnit', 'subEngineAmount'].includes(key)
    ) {
      const { subEnginePower, subEngineUnit, subEngineAmount } = allValues;
      const subEngineOutput = adjustPrecision(
        subEnginePower * subEngineAmount * engineUnits[subEngineUnit]
      );

      particularForm.setFieldsValue({ ...allValues, subEngineOutput });
    }
  };

  /* Variables */
  const [leftPanelTemplate, rightPanelTemplate] = setTemplates();

  return (
    <Form
      form={particularForm}
      initialValues={
        isFerry ? engineForms.initalState : engineForms.ferryInitialState
      }
      onValuesChange={handleFormChangeValue}
      onFinish={handleFinishForm}
      onFinishFailed={handleFinishForm}
    >
      <div className="engine-particular-container">
        <div className="content-box particular-box">
          <div className="left-page page">
            <div className="page-header">주엔진</div>
            <div className="page-content">
              <FormBoard
                key={shipId}
                id={'ME'}
                particularForm={particularForm}
                template={leftPanelTemplate}
              />
            </div>
          </div>
          <div className="right-page page">
            <div className="page-header">보조엔진</div>
            <div className="page-content">
              <FormBoard
                key={shipId}
                id={'SE'}
                particularForm={particularForm}
                template={rightPanelTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default React.memo(EngineParticular);
