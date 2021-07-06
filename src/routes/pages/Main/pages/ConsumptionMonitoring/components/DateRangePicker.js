import moment from 'moment';
import React, { useEffect, useState } from 'react';

/**
 * DateRangePicker
 * --
 */
const DateRangePicker = ({ date, onChangeDate = () => {} }) => {
  /* Parser */
  const nowYear = parseInt(moment(date).format('YYYY'));
  const nowMonth = parseInt(moment(date).format('MM'));

  /* Functions */
  /**
   *
   */
  const handleClickYear = (flag) => {
    const newYear = flag === 'PREV' ? nowYear - 1 : nowYear + 1;

    onChangeDate(`${newYear}-${nowMonth}`);
  };

  /**
   *
   */
  const handleClickMonth = (month) => {
    onChangeDate(`${nowYear}-${month}`);
  };

  /**
   *
   */
  const monthBox = Array(12)
    .fill(null)
    .map((d, i) => {
      const loopMonth = i + 1;
      return (
        <button
          key={i}
          className={`month-item ${nowMonth === loopMonth ? 'active' : ''}`}
          onClick={() => {
            handleClickMonth(loopMonth);
          }}
        >
          {loopMonth}월
        </button>
      );
    });

  /* RENDER */
  return (
    <div className="datepicker-container">
      <div className="datepicker-flex-box">
        <div className="year-change-interface-box">
          <div
            className="left-swipe-btn swipe-btn"
            onClick={() => {
              handleClickYear('PREV');
            }}
          >
            {'<<'}
          </div>
          <div className="now-year-text">{nowYear}</div>
          <div
            className="right-swipe-btn swipe-btn"
            onClick={() => {
              handleClickYear('NEXT');
            }}
          >
            {'>>'}
          </div>
        </div>
        <div className="month-box">{monthBox}</div>
      </div>
    </div>
  );
};

const initialDate = moment().format('YYYY-MM');

DateRangePicker.defaultProps = {
  date: initialDate,
};

export default DateRangePicker;
