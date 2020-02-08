export const ADD_MATERIAL = 'ADD_MATERIAL';
export const REMOVE_MATERIAL = 'REMOVE_MATERIAL';
export const UPDATE_MATERIAL = 'UPDATE_MATERIAL';

export const addMaterial = material => {
  return {
    type: ADD_MATERIAL,
    payload: material,
  };
};

export const removeMaterial = materialId => {
  return {
    type: REMOVE_MATERIAL,
    payload: materialId,
  };
};

export const updateMaterial = material => {
  return {
    type: UPDATE_MATERIAL,
    payload: material,
  };
};
