// Library imports
import uuid from 'uuid';

/**
 * A layout rectangle.
 */
export default class Rect {
  /**
   * Create a new layout rectangle.
   *
   * @param {string} name - The rectangle name
   * @param {number} width - The rectangle width
   * @param {number} height - The rectangle height
   * @param {number} index - The index if the same rectangle exists multiple times
   */
  static create(name, width, height, index) {
    return new Rect(undefined, width, height, 0, 0, name, index);
  }

  /**
   * Constructor.
   *
   * @param {string} itemId - The id of the rect containing item
   * @param {number} width - The rectangle width
   * @param {number} height - The rectangle height
   * @param {number} [x=0] - The x position, defaults to 0
   * @param {number} [y=0] - The y position, defaults to 0
   * @param {string} [name=''] - The rectangle name
   */
  constructor(itemId, width, height, x = 0, y = 0, name = '', index = 0) {
    this._id = uuid();
    this._itemId = itemId;
    this._area = width * height;
    this._height = height;
    this._name = name;
    this._posX = x;
    this._posY = y;
    this._width = width;
    this._index = index;
    this._cuttingWidth = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this._sheet = undefined;
  }

  /** *************************** */
  /** **** Getters & Setters **** */
  /** *************************** */

  get area() {
    return this._area;
  }

  get bottomPosition() {
    return this._posY + this.fullHeight;
  }

  get cuttingWidth() {
    return this._cuttingWidth;
  }

  set cuttingWidth(newCuttingWidth) {
    this._cuttingWidth = { ...this._cuttingWidth, ...newCuttingWidth };
  }

  get fullWidth() {
    return this._cuttingWidth.left + this._width + this._cuttingWidth.right;
  }

  get fullHeight() {
    return this._cuttingWidth.top + this._height + this._cuttingWidth.bottom;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
  }

  get id() {
    return this._id;
  }

  get index() {
    return this._index;
  }

  get itemId() {
    return this._itemId;
  }

  get name() {
    return this._name;
  }

  get numberOfCuts() {
    return Object.values(this._cuttingWidth).filter(cw => cw > 0).length;
  }

  get posX() {
    return this._posX;
  }

  set posX(value) {
    this._posX = value;
  }

  get posY() {
    return this._posY;
  }

  set posY(value) {
    this._posY = value;
  }

  get rightPosition() {
    return this._posX + this.fullWidth;
  }

  get sheet() {
    return this._sheet;
  }

  set sheet(sheet) {
    this._sheet = sheet;
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }
}
