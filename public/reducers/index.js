import { combineReducers } from 'redux';
import Models from './models';
import ActiveProp from './active-prop-reducer';

const rootReducer = combineReducers({
  Models:Models,
  ActiveProp:ActiveProp
});

export default rootReducer;
