import React, { useEffect } from 'react';
import c3 from 'c3';
console.log('c3: ', c3);

const LineChart = ({ id, x = [], y = [], y2 = [], grid = false }) => {
  useEffect(() => {
    c3.generate({
      bindto: `#${id}`,
      data: {
        x: 'load',
        y: '속도',
        y2: '연료소모량',
        columns: [
          ['load', ...x],
          ['속도', ...y],
          ['연료소모량', ...y2],
        ],

        axes: {
          연료소모량: 'y2',
        },

        types: {
          속도: 'area',
          연료소모량: 'area',
        },
      },
      grid: {
        x: {
          show: grid,
        },
        y: { show: grid },
      },
      axis: {
        x: {
          label: {
            text: '부하',
            position: 'outer-center',
          },
          tick: {
            outer: false,
          },
        },
        y: {
          label: {
            text: '선속',
            position: 'outer-middle',
          },
          tick: {
            values: y,
            outer: false,
          },
          padding: {},
          // center: y[2],
        },
        y2: {
          show: true,
          label: {
            text: '연료소모량',
            position: 'outer-middle',
          },
          tick: {
            outer: false,
            values: y2,
            format: (d) => d.toFixed(0),
          },
          // center: y2[2],
        },
      },
      onrendered: () => {
        // c3.chart;
        let $axisYLabel = document.querySelector(
          `.${c3.chart.internal.fn.CLASS.axisYLabel}`
        );
        if ($axisYLabel) {
          let attrs = $axisYLabel.getAttribute('transform');
          // $axisYLabel.setAttribute('transform', 'rotate(0)');
          // $axisYLabel.setAttribute('dy', 10);
        }
      },
    });
    return () => {};
  }, [x, y, y2]);

  return <div id={id} className="consumption-chart"></div>;
};

export default LineChart;
