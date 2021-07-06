import { produce } from 'immer'

/**
 * shipList: 지도에 표시되는 선박 리스트
 * selectShip: 지도, 헤더에서 선택한 선박
 * listType: 헤더 리스트 탭에서 선택한 선종
 */
const initialState = {
	shipList: [],
	selectShip: { id: 0 },
	listType: null
}

const SET_LIST = 'FLEET/SET_LIST';
const SET_SHIP = 'FLEET/SET_SHIP';
const SET_LIST_TYPE = 'FLEET/SET_LIST_TYPE';

export const fleetActions = {
	setList: (shipList) => ({ type: SET_LIST, shipList }),
	setShip: (shipId) => ({ type: SET_SHIP, shipId }),
	setListType: (listType) => ({ type: SET_LIST_TYPE, listType })
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
        case SET_LIST:
            const { shipList } = action;

            return produce(state, (draftState) => {
                draftState.shipList = shipList;
            });
        case SET_SHIP:
            const { shipId } = action;

            return produce(state, (draftState) => {
                if (shipId === 0 || shipId === undefined) {
                    draftState.selectShip = { id: 0 }
                } else {
                    draftState.selectShip = draftState.shipList.find(
                        (v) => v.id === shipId
                    )
                }
            });
        case SET_LIST_TYPE:
            const { listType } = action;

            return produce(state, (draftState) => {
                draftState.listType = listType;
            });
        default:
            return state;
	}
}

export default reducer;
