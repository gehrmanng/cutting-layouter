// Library imports
import { v4 as uuid } from 'uuid';

// Local data object imports
import Rect from './Rect';

/**
 * A layout item.
 */
export default class Item {
  static of = (otherItem) => {
    const newItem = new Item(
      otherItem.name,
      otherItem.width,
      otherItem.height,
      otherItem.quantity,
      otherItem.material,
      otherItem.id,
    );
    newItem.sheet = otherItem.sheet;
    return newItem;
  };

  /**
   * Constructor.
   *
   * @param {string} name The item name
   * @param {number} width The item width
   * @param {number} height The item height
   * @param {number} quantity The quantity of rects
   * @param {Material} material The item material
   * @param {string} id An optional id
   */
  constructor(name, width, height, quantity, material, id) {
    this._id = id || uuid();
    this._name = name;
    this._dimensions = Rect.create(name, width, height);
    this._quantity = quantity;
    this._material = material;
    this._sheet = [];
    this._color = `hsla(${Math.random() * 360}, 100%, 50%, 0.5)`;
    this._placed = 0;
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

  addPlaced(value) {
    this._placed += value;
  }

  /**
   * **************************
   */
  /**
   * *** Getters & Setters ****
   */
  /**
   * **************************
   */

  get color() {
    return this._color;
  }

  get dimensions() {
    return this._dimensions;
  }

  get height() {
    return this._dimensions.height;
  }

  set height(height) {
    this._dimensions.height = height;
  }

  get id() {
    return this._id;
  }

  get material() {
    return this._material;
  }

  set material(material) {
    this._material = material;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get placed() {
    return this._placed;
  }

  set placed(placed) {
    this._placed = placed;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(quantity) {
    this._quantity = quantity;
  }

  get sheet() {
    return this._sheet;
  }

  set sheet(sheet) {
    this._sheet = sheet;
  }

  get width() {
    return this._dimensions.width;
  }

  set width(width) {
    this._dimensions.width = width;
  }
}
