import URL from './apiContstant';
import ApiManager from 'utils/ApiManager';

const $http = new ApiManager();

export default {
    _getShipList: async () => {
        try {
            const url = URL.GET_SHIP_LIST;
            const response = await $http.get(url);

            return response;
        } catch (error) {
            return false;
        }
    },
    _getShipRoute: async (mmsi, date) => {        
        try {
            const url = URL.GET_SHIP_ROUTE.replace(
                ':mmsi', mmsi
            ).replace(
                ':start', date[0]
            ).replace(
                ':end', date[1]
            );
            
            const response = await $http.get(url);

            return response;
        } catch (error) {
            return false;
        }
    }
};
