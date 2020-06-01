// Local Redux action imports
import { ADD_MATERIAL, REMOVE_MATERIAL, UPDATE_MATERIAL } from '../actions/actionTypes';

// Local data object imports
import { Material } from '../bin-packing';

// Data Import
import { materials } from '../data/testitemdata';

// Initial state definition
const initialState = {
  materials: [...materials],
};

/**
 * A Redux reducer for layout items.
 *
 * @param {object} state The reducer state
 * @param {object} action The reducer action
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MATERIAL:
      return {
        materials: [...state.materials, action.payload],
      };
    case REMOVE_MATERIAL:
      return {
        materials: state.materials.filter((i) => i.id !== action.payload),
      };
    case UPDATE_MATERIAL:
      return {
        materials: state.materials.map((material) => {
          if (material.id === action.payload.id) {
            return action.payload;
          }
          return material;
        }),
      };
    default:
      return state;
  }
};

// Export the reducer as default
export default reducer;
