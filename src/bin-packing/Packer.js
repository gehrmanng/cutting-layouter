/* eslint-disable class-methods-use-this */
// Library imports
import _ from 'underscore';

// Local data object imports
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
   * @param {Item[]} items - The items to pack
   * @param {Material[]} materials - All available layout materials
   * @returns {Sheet} All packed layout sheets
   */
  pack(items, materials) {
    const itemsByMaterial = _.groupBy(items, 'material');

    Object.entries(itemsByMaterial).forEach(([key, value]) => {
      const material = materials.filter(m => m.id === parseInt(key, 10)).pop();

      if (!material) {
        return;
      }

      this._packByMaterial(material, value);
    });

    return this._sheets;
  }

  /**
   *
   * @param {Material} material The current sheet material
   * @param {Item[]} items All layout items with the given sheet material
   */
  _packByMaterial(material, items) {
    const sheet = new Sheet(this._sheetCounter, material.width, material.height, items, 5);
    sheet.pack();
    this._sheets.push(sheet);
    this._sheetCounter += 1;
  }
}
