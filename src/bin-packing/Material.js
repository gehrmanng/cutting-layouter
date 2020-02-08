// Library imports
import uuid from 'uuid';

/**
 * A layout material.
 */
export default class Material {
  /**
   * Constructor.
   *
   * @param {number} id - The material id
   * @param {string} name - The material name
   * @param {number} width - The material width
   * @param {number} height - The material height
   * @param {number} thickness - The material thickness
   * @param {bool} hasGrain - Flag indicating if this material as a defined grain
   */
  constructor(id, name, width, height, thickness, hasGrain) {
    this._id = id || uuid();
    this._name = name;
    this._width = width;
    this._height = height;
    this._thickness = thickness;
    this._hasGrain = hasGrain;
    this._isUsed = false;
  }

  /** *************************** */
  /** **** Getters & Setters **** */
  /** *************************** */

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get width() {
    return this._width;
  }

  get hasGrain() {
    return this._hasGrain;
  }

  get height() {
    return this._height;
  }

  get thickness() {
    return this._thickness;
  }

  get isUsed() {
    return this._isUsed;
  }

  set isUsed(isUsed) {
    this._isUsed = isUsed;
  }
}
