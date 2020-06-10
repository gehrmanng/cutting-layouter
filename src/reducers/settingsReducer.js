// Initial state definition
const initialState = {
  bladeWidth: 5,
  minItemWidth: 100,
  minItemHeight: 100,
};

/**
 * A Redux reducer for layout items.
 *
 * @param {object} state The reducer state
 * @param {object} action The reducer action
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Export the reducer as default
export default reducer;
