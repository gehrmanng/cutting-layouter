// Library imports
import { createStore } from 'redux';

// Reducer imports
import rootReducer from './reducers';

// Create and export the Redux store
const store = createStore(rootReducer);
export default store;
