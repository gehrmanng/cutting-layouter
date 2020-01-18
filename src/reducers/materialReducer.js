// Local data object imports
import { Material } from '../bin-packing';

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
    new Material(9, 'TestMaterial', 1000, 600, 10),
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
    default:
      return state;
  }
};

// Export the reducer as default
export default reducer;
