import NewInputForm from 'components/dataEntry/newInputForm';
import React, { useEffect, useState } from 'react';
import RESET_ICON from 'assets/svgs/btn_reset.svg';
import { Modal } from 'antd';
import { ParticularAPI } from 'api';
import MessageAlert from 'utils/MessageAlert';
import { useSelector } from 'react-redux';

/**
 * InputForm 에서는 데이터를 다루고 UI는 이 컴포넌트에서 처리한다.
 * @param {*} param
 * @returns
 */
const FormBoard = ({ id, template, particularForm }) => {
  /* States */
  const [toggle, setToggle] = useState({});
  const { shipId } = useSelector((state) => state.vessel.selectParticular);

  /* Hooks */
  useEffect(() => {
    initToggle();
  }, [template]);

  const initToggle = () => {
    template.forEach((row) => {
      row.cols.forEach((col) => {
        const { data, attr = {} } = col;
        const config = {
          ...data,
          ...attr,
        };

        if (config.toggle === true) {
          let newToggle = {
            ...toggle,
          };
          newToggle[config.cKey] = true;

          setToggle(newToggle);
        }
      });
    });
  };

  return (
    <>
      <div className="form-board" key={id}>
        {template.map((row, idx) => {
          return (
            <div className="row" key={`${id}-${idx}-row`}>
              {row.cols.map((col, colIdx) => {
                const { data, attr = {} } = col;

                // 빈 공백용 div 태그만 리턴
                if (!data) {
                  return <div className="col"></div>;
                }

                const config = {
                  ...data,
                  ...attr,
                };

                const resetIconElement = data.resetIcon ? (
                  <img
                    src={RESET_ICON}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      console.log('shipId: ', shipId);
                      ParticularAPI.getRecollectAisData(shipId).then((res) => {
                        if (res) {
                          MessageAlert.success('수신 성공');
                          Modal.destroyAll();
                        } else {
                          MessageAlert.error('재수신 실패');
                          Modal.destroyAll();
                        }
                      });

                      Modal.success({
                        centered: true,
                        maskClosable: true,
                        modalRender: () => {
                          return (
                            <div className="loading-modal-container">
                              <div className="loading-spin-area">
                                <div className="custom-loader"></div>
                              </div>
                              <div className="text-area">
                                <div className="title">데이터 불러오는 중…</div>
                                <div className="sub-title">
                                  (최대 10분 이상 소요)
                                </div>
                              </div>
                            </div>
                          );
                        },
                      });
                    }}
                  />
                ) : (
                  <></>
                );

                return (
                  <div key={colIdx} className={`col ${row.fill ? 'fill' : ''}`}>
                    <div className="input-form-field-box">
                      <div className="input-form-label">
                        {config.label}{' '}
                        <span className="input-form-unit">
                          {config.unit ? `(${config.unit})` : null}
                        </span>
                        {resetIconElement}
                      </div>
                      <div className="input-form-sub-label">
                        {config.subLabel}
                      </div>
                      <div className="input-form-field">
                        <NewInputForm
                          form={particularForm}
                          config={config}
                          toggle={toggle[config.cKey]}
                        />
                      </div>
                      <div className="input-form-gutter-box">
                        {config.gutterText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FormBoard;
