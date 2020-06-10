// Local Redux action imports
import { ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM } from '../actions/actionTypes';

// Local data object imports
import { Item } from '../bin-packing';

import osbItems from '../data/osbitemdata';
import { testItems } from '../data/testitemdata';

// Initial state definition
const initialState = {
  items: [
    // ...testItems.gt17,
    ...osbItems.s6,

    // Remove tests
    // new Item('X_A', 400, 100, 1, 10),
    // new Item('X_B', 250, 50, 2, 10),
  ],
};

/**
 * A Redux reducer for layout items.
 *
 * @param {object} state The reducer state
 * @param {object} action The reducer action
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        items: [...state.items, action.payload],
      };
    case REMOVE_ITEM:
      return {
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case UPDATE_ITEM:
      return {
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        }),
      };
    default:
      return state;
  }
};

// Export the reducer as default
export default reducer;
