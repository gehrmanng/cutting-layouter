import { combineReducers } from 'redux';

import itemReducer from './itemReducer';
import materialReducer from './materialReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({ itemReducer, materialReducer, settingsReducer });
