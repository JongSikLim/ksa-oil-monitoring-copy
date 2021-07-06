import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './reducer';

const reducer = combineReducers(reducers);

const store = createStore(reducer, composeWithDevTools(applyMiddleware()));

export default store;
