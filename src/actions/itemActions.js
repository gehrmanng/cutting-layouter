export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';

export const addItem = item => {
  return {
    type: ADD_ITEM,
    payload: item,
  };
};

export const removeItem = itemId => {
  return {
    type: REMOVE_ITEM,
    payload: itemId,
  };
};

export const updateItem = item => {
  return {
    type: UPDATE_ITEM,
    payload: item,
  };
};
