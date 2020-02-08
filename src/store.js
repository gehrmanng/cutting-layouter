// Library imports
import { createStore } from 'redux';
import { throttle } from 'underscore';

import { Item, Material } from './bin-packing';

// Reducer imports
import rootReducer from './reducers';

const loadState = () => {
  try {
    const serializedItems = localStorage.getItem('items');
    let deserializedItems;
    if (serializedItems !== null) {
      deserializedItems = JSON.parse(serializedItems).map(o => Item.deserialize(o));
    }

    const serializedMaterials = localStorage.getItem('materials');
    let deserializedMaterials;
    if (serializedMaterials !== null) {
      deserializedMaterials = JSON.parse(serializedMaterials).map(o => Material.deserialize(o));
    }

    if (!deserializedItems && !deserializedMaterials) {
      return undefined;
    }

    const result = {};
    if (deserializedItems) {
      result.itemReducer = { items: deserializedItems };
    }
    if (deserializedMaterials) {
      result.materialReducer = { materials: deserializedMaterials };
    }

    return result;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const saveState = state => {
  try {
    const serializedItems = state.itemReducer.items.map(i => i.serialize());
    const serializedMaterials = state.materialReducer.materials.map(m => m.serialize());
    localStorage.setItem('items', JSON.stringify(serializedItems));
    localStorage.setItem('materials', JSON.stringify(serializedMaterials));
  } catch (err) {
    console.error(err);
  }
};

// Create and export the Redux store
const store = createStore(rootReducer, loadState());
store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000),
);

export default store;
