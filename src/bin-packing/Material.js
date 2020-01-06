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
   */
  constructor(id, name, width, height, thickness) {
    this._id = id;
    this._name = name;
    this._width = width;
    this._height = height;
    this._thickness = thickness;
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

  get height() {
    return this._height;
  }

  get thickness() {
    return this._thickness;
  }
}
