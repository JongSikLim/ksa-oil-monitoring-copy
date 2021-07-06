/**
 *
 *
 */
import { message } from 'antd';

message.config({
  // top: 100,
  // duration: 2,
  maxCount: 5
});

export default {
  /** Success */
  success: (m = 'success', time = 1.2) => message.success(m, time),

  /** error */
  error: (m = 'error', time = 1.2) => message.error(m, time),

  /** warning */
  warning: (m = 'warning', time = 1.2) => message.warning(m, time)
};
