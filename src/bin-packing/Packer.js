/* eslint-disable class-methods-use-this */
// Library imports
import _ from 'underscore';

// Local data object imports
import Rect from './Rect';
import Sheet from './Sheet';

/**
 * A packer for layout items.
 */
export default class Packer {
  constructor() {
    this.bins = [];
    this._sheets = [];
    this._sheetCounter = 0;
  }

  /**
   * Pack the given items into matching bins.
   *
   * @param {Array.<Item>} items The items to pack
   * @param {Array.<Material>} materials All available layout materials
   * @return {Sheet} All packed layout sheets
   */
  pack(items, materials) {
    const itemsByMaterial = _.groupBy(items, 'material');

    Object.entries(itemsByMaterial).forEach(([key, value]) => {
      const material = materials.filter((m) => m.id === parseInt(key, 10)).pop();

      if (!material) {
        return;
      }

      this._packByMaterial(material, value);
    });

    return this._sheets;
  }

  /**
   * @param {Material} material The current sheet material
   * @param {Array.<Item>} items All layout items with the given sheet material
   */
  _packByMaterial(material, items) {
    const notAddedItems = items.filter(
      (i) => i.height > material.height || i.width > material.width,
    );

    const allRects = [];
    items
      .filter((i) => i.height <= material.height && i.width <= material.width)
      .forEach((item) => {
        for (let i = 0; i < item.quantity; i += 1) {
          allRects.push(new Rect(item.id, item.width, item.height, 0, 0, item.name, item.color, i));
        }
      });

    let remainingRects = [];

    do {
      const sheet = new Sheet(
        this._sheetCounter,
        material.width,
        material.height,
        items,
        5,
        material,
      );
      const stillRemainingRects = sheet.pack(allRects);
      this._sheets.push(sheet);
      this._sheetCounter += 1;

      const usedItemIds = sheet.getItemIds();
      usedItemIds.forEach((id) => {
        const item = items.find((i) => i.id === id);
        if (item) {
          item.sheet.push(sheet.sheetNumber);
        }
      });

      if (stillRemainingRects.length !== remainingRects.length) {
        remainingRects = stillRemainingRects;
      } else {
        break;
      }
    } while (remainingRects.length > 0);
  }
}
