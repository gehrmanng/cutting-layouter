/* eslint-disable no-restricted-syntax */
// Library imports
import uuid from 'uuid';

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
   * @param {Item[]} items All items that should be added to this sheet
   * @param {number} bladeWidth The blade width
   */
  constructor(sheetNumber, width, height, items, bladeWidth) {
    this._id = uuid();
    this._sheetNumber = sheetNumber;
    this._width = width;
    this._height = height;
    this._items = items;
    this._bladeWidth = bladeWidth;
    this._sheetArea = new SheetArea(this._width, this._height, this._height, this._bladeWidth);
    this._grouper = new Grouper(this._bladeWidth);
  }

  /**
   * Pack as many layout items as possible into this sheet.
   *
   * @returns {Item[]} All remaining items
   */
  pack() {
    const allRects = [];
    const notAddedItems = this._items.filter(i => i.height > this._height || i.width > this._width);
    this._items
      .filter(i => i.height <= this._height && i.width <= this._width)
      .forEach(item => {
        for (let i = 0; i < item.quantity; i += 1) {
          allRects.push(new Rect(item.id, item.width, item.height, 0, 0, item.name));
        }
      });

    const remainingRects = this._grouper.group(allRects, this._sheetArea);
    if (remainingRects.length) {
      // this._grouper.group(remainingRects, this._sheetArea);
    }

    return notAddedItems;
  }

  /** *************************** */
  /** **** Getters & Setters **** */
  /** *************************** */

  get height() {
    return this._height;
  }

  get id() {
    return this._id;
  }

  get sheetArea() {
    return this._sheetArea;
  }

  get width() {
    return this._width;
  }
}
