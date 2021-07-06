import React, { useEffect, useState } from 'react';
import c3 from 'c3';

const MIN = 70;
const MAX = 130;

const ScatterChart = ({ id, x, y, adequateValue = 120 }) => {
  const newY = y.map((d) => {
    if (d < MIN) {
      return MIN;
    } else if (d > MAX) {
      return MAX;
    }
    return d;
  });

  useEffect(() => {
    document.querySelectorAll('.c3-shape').forEach((el) => {
      el.getAttribute('cy');
    });
  }, [adequateValue]);

  useEffect(() => {
    c3.generate({
      bindto: `#${id}`,
      size: {
        width: 1100,
        height: 210,
      },
      data: {
        colors: {
          consumption: (data) => {
            return data.value > adequateValue ? '#ff1a51' : '#2f90f1';
          },
        },
        x: 'x',
        y: 'consumption',
        columns: [
          ['x', ...x],
          ['consumption', ...newY],
        ],
        type: 'scatter',
      },
      axis: {
        x: {
          label: false,
          min: 1,
          max: 12,
          padding: 1,
          tick: {
            // outer: false,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            format: function (d) {
              return `${d}월`;
            },
          },
        },
        y: {
          min: MIN,
          max: MAX,
          padding: 0,
          tick: {
            // outer: true,
            count: 5,
            values: [80, 90, 100, 110, 120],
          },
        },
      },
      tooltip: {
        show: false,
      },
      grid: {
        y: {
          show: { grid: true },
          lines: [
            { value: adequateValue, text: '적정 범위', class: 'adequate-line' },
          ],
        },
      },
      point: {
        focus: {
          expand: {
            enabled: false,
          },
        },
      },
      legend: {
        hide: true,
      },
      onrendered: () => {},
    });

    return () => {};
  }, [id, x, y, adequateValue]);

  return <div id={id}></div>;
};

ScatterChart.defaultProps = {
  id: '',
  x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  y: [],
  adequateValue: 120,
};
export default React.memo(ScatterChart);
