// Library imports
import uuid from 'uuid';

// Local data object imports
import Rect from './Rect';

/**
 * A layout item.
 */
export default class Item {
  /**
   * Constructor.
   *
   * @param {string} name - The item name
   * @param {number} width - The item width
   * @param {number} height - The item height
   * @param {number} quantity - The quantity of rects
   * @param {Material} material - The item material
   * @param {string} id - An optional id
   */
  constructor(name, width, height, quantity, material, id) {
    this._id = id || uuid();
    this._name = name;
    this._dimensions = Rect.create(name, width, height);
    this._quantity = quantity;
    this._material = material;
  }

  serialize() {
    return {
      id: this._id,
      name: this._name,
      width: this._dimensions.width,
      height: this._dimensions.height,
      quantity: this._quantity,
      material: this._material,
    };
  }

  static deserialize(obj) {
    return new Item(obj.name, obj.width, obj.height, obj.quantity, obj.material, obj.id);
  }

  /** *************************** */
  /** **** Getters & Setters **** */
  /** *************************** */

  get dimensions() {
    return this._dimensions;
  }

  get height() {
    return this._dimensions.height;
  }

  get id() {
    return this._id;
  }

  get material() {
    return this._material;
  }

  get name() {
    return this._name;
  }

  get quantity() {
    return this._quantity;
  }

  get width() {
    return this._dimensions.width;
  }
}
