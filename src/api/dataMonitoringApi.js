import URL from './apiContstant';
import ApiManager from 'utils/ApiManager';
import MessageAlert from 'utils/MessageAlert';

const $http = new ApiManager();

export default {
    _getDataList: async () => {
        try {
            const url = URL.GET_DATAMONITORING_LIST;
            const {
                result: { status },
                rows
            } = await $http.get(url);

            if (status !== 200) {
                MessageAlert.warning('데이터 조회에 실패했습니다.');
                
                return {
                    status: false
                }
            }
            
            return {
                status: true,
                data: rows
            }
        } catch (error) {
            return false;
        }
    }
};
