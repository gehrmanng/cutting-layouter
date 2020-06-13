/* eslint-disable no-restricted-syntax */
// Library imports
import { v4 as uuid } from 'uuid';
import _ from 'underscore';

// Local data object imports
import Rect from './Rect';
import Grouper from './Grouper';
import SheetArea from './SheetArea';

/**
 * A layout sheet.
 */
export default class Sheet {
  /**
   * Constructor.
   *
   * @param {number} sheetNumber The sheet counting number
   * @param {number} width The sheet width
   * @param {number} height The sheet height
   * @param {Array.<Item>} items All items that should be added to this sheet
   * @param {number} bladeWidth The blade width
   * @param {Material} material The sheet material
   */
  constructor(sheetNumber, width, height, items, bladeWidth, material) {
    this._id = uuid();
    this._sheetNumber = sheetNumber;
    this._width = width;
    this._height = height;
    this._items = items;
    this._bladeWidth = bladeWidth;
    this._material = material;
    this._sheetArea = new SheetArea(
      this._width,
      this._height,
      this._height,
      this._bladeWidth,
      undefined,
      sheetNumber,
    );
    this._grouper = new Grouper(this._bladeWidth);
  }

  /**
   * Pack as many layout items as possible into this sheet.
   *
   * @return {Array.<Item>} All remaining items
   */
  pack(rects) {
    const remainingRects = this._grouper.group(rects, this._sheetArea);

    return remainingRects;
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

  get height() {
    return this._height;
  }

  get id() {
    return this._id;
  }

  get material() {
    return this._material;
  }

  get numberOfCuts() {
    return this._sheetArea.numberOfCuts;
  }

  get numberOfRects() {
    return this._sheetArea.numberOfRects;
  }

  get sheetArea() {
    return this._sheetArea;
  }

  get sheetNumber() {
    return this._sheetNumber;
  }

  get wastage() {
    const area = this._width * this._height;
    const { usedArea } = this._sheetArea;

    return ((area - usedArea) * 100) / area;
  }

  get wastageStr() {
    return Intl.NumberFormat('de', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
      this.wastage,
    );
  }

  get width() {
    return this._width;
  }
}
