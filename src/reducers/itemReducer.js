// Local Redux action imports
import { ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM } from '../actions/actionTypes';

// Local data object imports
import { Item } from '../bin-packing';

// Initial state definition
const initialState = {
  items: [
    new Item('A', 900, 600, 1, 8),
    new Item('B', 440, 390, 2, 8),
    // new Item('D', 740, 100, 1, 8),
    new Item('D', 740, 30, 2, 8),
    new Item('C', 700, 60, 2, 8),
    // new Item('A', 900, 600, 1),
    // new Item('B', 525, 390, 2),
    // new Item('D', 1055, 100, 1),
    // new Item('C', 1055, 60, 2),
    // new Item('A', 200, 400, 1, 9),
    // new Item('B', 50, 350, 1, 9),
    // new Item('C', 80, 350, 1, 9),
    // new Item('B', 1095, 50, 1, 8),
    // new Item('C', 50, 480, 1, 8),
    // new Item('D', 100, 50, 1, 8),
    // new Item('A', 1000, 50, 1, 9),
    // new Item('C', 50, 535, 1, 8),
    // new Item('A', 620, 200, 4, 1),
    // new Item('B', 620, 100, 4, 1),
    // new Item('C', 845, 620, 4, 1),
  ],
};

/**
 * A Redux reducer for layout items.
 *
 * @param {object} state - The reducer state
 * @param {object} action - The reducer action
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        items: [...state.items, action.payload],
      };
    case REMOVE_ITEM:
      return {
        items: state.items.filter(i => i.id !== action.payload),
      };
    case UPDATE_ITEM:
      return {
        items: state.items.map(item => {
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
