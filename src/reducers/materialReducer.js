// Local Redux action imports
import { ADD_MATERIAL, REMOVE_MATERIAL, UPDATE_MATERIAL } from '../actions/actionTypes';

// Local data object imports
import { Material } from '../bin-packing';

// Data Import
import { materials } from '../data/testitemdata';

// Initial state definition
const initialState = {
  materials: [
    new Material(1, 'OSB', 2500, 1250, 12),
    new Material(2, 'OSB', 2500, 1250, 15),
    new Material(3, 'Sperrholz Birke', 2500, 1250, 12, true),
    new Material(4, 'Sperrholz Birke', 2500, 1250, 15, true),
    new Material(5, 'MDF', 800, 600, 9),
    new Material(6, 'MDF', 1200, 600, 12),
    new Material(7, 'MDF', 2500, 1250, 15),
    new Material(8, 'Leimholz Eiche', 2000, 600, 20, true),
    new Material(9, 'TestMaterial', 885, 600, 10),
    new Material(10, 'Remove Test Material', 600, 200, 10),
    new Material(11, 'OSB Verlegeplatte', 2040, 665, 12, true),
    new Material(12, 'OSB Verlegeplatte', 2040, 665, 15, true),
    ...materials,
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
    case ADD_MATERIAL:
      return {
        materials: [...state.materials, action.payload],
      };
    case REMOVE_MATERIAL:
      return {
        materials: state.materials.filter(i => i.id !== action.payload),
      };
    case UPDATE_MATERIAL:
      return {
        materials: state.materials.map(material => {
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
