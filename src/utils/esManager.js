import { getCookie } from 'utils';

/**
 * 객체의 속성 갯수를 반환
 * @param { Object } obj 갯수를 알고 싶은 객체
 */
export const getObjectSize = (obj) => {
  let size = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export const checkNaN = (number, defaultValue = 0) => {
  if (Number.isNaN(number)) {
    return defaultValue;
  } else {
    return number;
  }
};

/* @description 실수의 소수점을 절삭하여 반환한다.
 * @param num 소숫점 절삭할 숫자
 * @param precision 절삭할 소숫점 자릿수
 * @return Success => 소수점 처리한 실수
 * @return Failure => num이 NaN인경우 0 반환
 */
export const adjustPrecision = (num, precision = 0) => {
  if (Number.isNaN(num)) return 0;
  if (precision === 0) {
    return parseInt(num.toFixed(0));
  }

  const loopArray = Array(precision).fill(10);
  const correctionValue = loopArray.reduce((prev, curr) => {
    return prev * 10;
  });
  return Math.floor(num * correctionValue) / correctionValue;
};

/**
 * @title a 태그 다운로드
 * @description a 태그를 통해서 파일을 다운로드한다.
 * @param URL 다운로드를 요청할 URL
 */
export const downloadFromUrl = (URL) => {
  const token = getCookie('KSA_ACCESS_TOKEN');
  let aElement = document.createElement('a');
  const tokenURL = `${URL}${URL.includes('?') ? '&token=' : '?token='}` + token;

  aElement.href = tokenURL;
  aElement.download = null;
  document.body.appendChild(aElement);
  aElement.click();
  aElement.remove();
};

/**
 * @title 숫자 입력 input 태그 콤마 파싱
 * @description input 태그에서 입력한 값을 세자리 단위로 콤마파싱하여 반환
 * @param {String} str 입력한 string 값
 */
export const parseCommaInputNumber = (str) => {
  let [integer, decimal = null] = String(str).split('.');

  integer = integer.replace(/[^\d.-]+/g, '');
  integer = integer.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

  return `${integer}${decimal === null ? '' : `.${decimal}`}`;
};

export const uncomma = (str) => {
  let newString = String(str);

  newString = newString.replace(/[^\d.-]+/g, '');

  return newString;
};
