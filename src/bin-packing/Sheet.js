/* eslint-disable no-restricted-syntax */
import uuid from 'uuid';

import Rect from './Rect';
import Grouper from './Grouper';
import SheetArea from './SheetArea';

export default class Sheet {
  constructor(sheetNumber, width, height, items, bladeWidth) {
    this._id = uuid();
    this._sheetNumber = sheetNumber;
    this._width = width;
    this._height = height;
    this._items = items;
    this._bladeWidth = bladeWidth;
  }

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

    this._sheetArea = new SheetArea(this._width, this._height, this._height, this._bladeWidth);
    new Grouper(this._bladeWidth).group(allRects, this._sheetArea);

    return notAddedItems;
  }

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
