// Library imports
import _ from 'underscore';
import uuid from 'uuid';

/**
 * An area within a layout sheet.
 */
export default class SheetArea {
  /**
   * Constructor.
   *
   * @param {number} width The area width
   * @param {number} height The area height
   * @param {number} maxHeight The maximum height if this area needs to be extended
   * @param {number} bladeWidth The blade width
   * @param {SheetArea} [parent] The parent of this sheet area
   */
  constructor(width, height, maxHeight, bladeWidth, parent, sheet) {
    this._id = uuid();
    this._bladeWidth = bladeWidth;
    this._cuttingWidth = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this._height = height;
    this._maxHeight = maxHeight || height;
    this._nestedAreas = [];
    this._parent = parent;
    this._posX = 0;
    this._posY = 0;
    this._rects = [];
    this._width = width;
    this._grid = new Array(height).fill(0);
    this._sheet = sheet;
  }

  /**
   * Add a new nested sheet area.
   *
   * @param {SheetArea} newNestedArea The new nested sheet area
   */
  addNestedArea(newNestedArea) {
    const [posX, posY] = this._getGridPosition(newNestedArea.fullWidth, newNestedArea.fullHeight);
    newNestedArea.posX = posX;
    newNestedArea.posY = posY;
    newNestedArea.sheet = this._sheet;
    this._setCuttings(newNestedArea);
    this._nestedAreas.push(newNestedArea);
    this.updateGrid(posY, newNestedArea.rightPosition, newNestedArea.fullHeight);
  }

  /**
   * Add a new rect to this sheet area.
   *
   * @param {Rect} newRect The rect to be added
   */
  addRect(newRect) {
    const [posX, posY] = this._getGridPosition(newRect.fullWidth, newRect.fullHeight);
    newRect.posX = posX;
    newRect.posY = posY;
    newRect.sheet = this._sheet;
    this._setCuttings(newRect);
    this._rects.push(newRect);
    this.updateGrid(posY, newRect.posX + newRect.fullWidth, newRect.fullHeight);
  }

  /**
   * Check if a rect or sheet area with the given width and height can be added to this sheet area.
   *
   * @param {number} width The required width
   * @param {number} height The required height
   * @param {boolean} fillRemaining Flag indicating if the given width should fill all remaining width
   * @returns {boolean|number[]} The x and y coordinates if the required space is available, false otherwise
   */
  canAdd(width, height, fillRemaining, useCurrentHeight) {
    const [posX, posY] = this._getGridPosition(width, height, useCurrentHeight);

    const canAdd =
      posX >= 0 &&
      posY >= 0 &&
      (!fillRemaining ||
        (fillRemaining &&
          (posX + width === this._width || posX + width + this._bladeWidth >= this._width)));
    return canAdd ? [posX, posY] : false;
  }

  extendHeight(byHeight, rectOrArea) {
    if (!rectOrArea && !byHeight) {
      return false;
    }

    let extendByHeight;
    if (rectOrArea) {
      if (this.canAdd(rectOrArea.width, rectOrArea.height, false, true)) {
        return true;
      }

      const coords = this.canAdd(rectOrArea.width, rectOrArea.height, false, false);
      if (!coords) {
        return false;
      }

      extendByHeight = coords[1] + rectOrArea.height - this.height;
    }

    extendByHeight = extendByHeight || byHeight;

    if (!extendByHeight) {
      return false;
    }

    let lowestChildren;
    if (this.children.length) {
      const lowestChild = _.max(this.children, child => child.bottomPosition);

      lowestChildren = this.children.filter(c => c.bottomPosition === lowestChild.bottomPosition);
      if (
        lowestChild.bottomPosition === this._height &&
        lowestChild.cuttingWidth.bottom < this._bladeWidth
      ) {
        extendByHeight += this._bladeWidth - lowestChild.cuttingWidth.bottom;
      }
    }

    const extendedHeight = this._height + extendByHeight;
    if (extendedHeight > this._maxHeight) {
      return false;
    }

    if (this._parent) {
      const parentExtended = this._parent.extendHeightForChild(extendedHeight, this);
      if (!parentExtended) {
        return false;
      }
    }

    this.updateGrid(this._height, 0, extendByHeight);
    this._height += extendByHeight;

    if (lowestChildren && lowestChildren.length) {
      lowestChildren.forEach(child => {
        child.cuttingWidth.bottom = this._bladeWidth;
        this.updateGrid(
          child.bottomPosition - this._bladeWidth,
          child.rightPosition,
          this._bladeWidth,
        );
      });
    }

    return true;
  }

  extendHeightForChild(newHeight, child) {
    let newChildBottom = child.posY + newHeight;
    if (newChildBottom > this._maxHeight) {
      return false;
    }

    let borderExceedsHeight = false;
    if (child.cuttingWidth.bottom > 0 && !this._parent) {
      borderExceedsHeight = newChildBottom + child.cuttingWidth.bottom > this._maxHeight;
      newChildBottom = Math.min(newChildBottom + child.cuttingWidth.bottom, this._maxHeight);
    }

    if (
      newChildBottom < this._height ||
      (newChildBottom === this._height && !borderExceedsHeight)
    ) {
      this.updateGrid(
        child.bottomPosition - child.cuttingWidth.bottom,
        child.rightPosition,
        newChildBottom - (child.bottomPosition - child.cuttingWidth.bottom),
      );
      return true;
    }

    let canExtend = true;
    for (let i = child.bottomPosition; i < newChildBottom; i += 1) {
      if (this._grid[i] > child.posX) {
        canExtend = false;
        break;
      }
    }

    if (!canExtend) {
      return false;
    }

    if (this._parent) {
      const parentExtended = this._parent.extendHeightForChild(newChildBottom, this);
      if (!parentExtended) {
        return false;
      }
    }

    if (child.cuttingWidth.bottom > 0) {
      child.cuttingWidth.bottom = 0;
    }

    this.updateGrid(
      child.bottomPosition,
      child.rightPosition,
      newChildBottom - child.bottomPosition,
    );
    this._height = newChildBottom;

    return true;
  }

  /**
   * Extend the height of this sheet area by the given value.
   *
   * @param {number} height The extension height
   * @returns {boolean} True if the height could be extended, false otherwise
   */
  extendHeightOld(height, usedWidth = 0) {
    if (height === 0) {
      return true;
    }

    if (this._height + height > this._maxHeight) {
      return false;
    }

    if (this._parent) {
      let extendedHeight = this._height + height;
      if (extendedHeight < this._maxHeight) {
        extendedHeight += Math.min(this._bladeWidth, this._maxHeight - extendedHeight);
      }

      if (this._posY + extendedHeight > this._parent.height) {
        const parentExtended = this._parent.extendHeight(
          this._posY + extendedHeight - this._parent.height,
          this.fullWidth,
        );
        if (!parentExtended) {
          return false;
        }
      }
    }
    const previousFullHeight = this.fullHeight;

    if (this._nestedAreas && this._nestedAreas.length) {
      const na = this._nestedAreas[this._nestedAreas.length - 1];
      if (na.cuttingWidth.bottom === 0) {
        this.updateGrid(na.posY + na.height, na.rightPosition, this._bladeWidth);
        this._height += this._bladeWidth;
        na.cuttingWidth = { bottom: this._bladeWidth };
      }
    } else if (this._rects && this._rects.length) {
      const maxPosY = Math.max(...this._rects.map(r => r.posY));
      const lastRects = this._rects.filter(r => r.posY === maxPosY);

      lastRects.forEach(r => {
        r.cuttingWidth = { bottom: this._bladeWidth };
        this.updateGrid(this._height, r.rightPosition, this._bladeWidth);
      });
      this._height += this._bladeWidth;
    }

    this.updateGrid(this._height, usedWidth, height);
    this._height += height;
    if (this._height === this._maxHeight) {
      this.cuttingWidth.bottom = 0;
    }

    if (this._parent) {
      this._parent.updateGrid(
        this._posY + previousFullHeight,
        this._posX + this.fullWidth,
        this.fullHeight - previousFullHeight,
      );
    }

    return true;
  }

  /**
   * Extend the width of this sheet area by the given value.
   *
   * @param {number} width The extension width
   */
  extendWidth(width) {
    this._width += width;

    if ((this._rects && this._rects.length) || (this._nestedAreas && this._nestedAreas.length)) {
      const byYPosition = _.groupBy([...this._rects, ...this._nestedAreas], 'posY');

      Object.values(byYPosition).forEach(collection => {
        collection.sort((l, r) => l.posX - r.posX);
        const last = _.last(collection);
        const rightCuttingWidth = Math.min(this._bladeWidth, width);
        last.cuttingWidth = { right: rightCuttingWidth };
        this.updateGrid(last.posY, last.rightPosition, last.fullHeight);
      });
    }

    if (this._parent) {
      if (this._posX + this._width === this._parent.width) {
        this._cuttingWidth.right = 0;
      }

      this._parent.updateGrid(this._posY, this.rightPosition, this.fullHeight);
    }
  }

  /**
   * Get the maximum height that a nested sheet area with the given width and height could be extended to.
   *
   * @param {number} width The required width
   * @param {number} height The required height
   * @returns {number} The maximum height or -1 if there is not enough space for the given width and height
   */
  getMaximumHeight(width, height) {
    const [posX, posY] = this._getGridPosition(width, height);
    if (posX >= 0 && posY >= 0) {
      return this._maxHeight - posY;
    }

    return -1;
  }

  /**
   * Get the remaining width at the given height.
   *
   * @param {number} atHeight The height to get the remaining width for
   * @returns {number} The remaining width
   */
  getRemainingWidth(atHeight) {
    const remaining = this._width - this._grid[atHeight];
    return remaining;
  }

  /** *************************** */
  /** **** Getters & Setters **** */
  /** *************************** */

  get bottomPosition() {
    return this._posY + this.fullHeight;
  }

  get children() {
    return [...this._nestedAreas, ...this._rects];
  }

  get cuttingWidth() {
    return this._cuttingWidth;
  }

  set cuttingWidth(newCuttingWidth) {
    this._cuttingWidth = { ...this._cuttingWidth, ...newCuttingWidth };
  }

  get fullHeight() {
    return this._cuttingWidth.top + this._height + this._cuttingWidth.bottom;
  }

  get fullWidth() {
    return this._cuttingWidth.left + this._width + this._cuttingWidth.right;
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

  get maxHeight() {
    return this._maxHeight;
  }

  set maxHeight(value) {
    this._maxHeight = value;
  }

  get nestedAreas() {
    return this._nestedAreas;
  }

  get numberOfCuts() {
    let result = Object.values(this._cuttingWidth).filter(cw => cw > 0).length;

    if (this._rects.length) {
      const sameHeightRowRects = _.groupBy(this._rects, r => `${r.posY}#${r.height}`);
      Object.values(sameHeightRowRects).forEach(rects => {
        result += rects.filter(r => r.cuttingWidth.right > 0).length;
        if (rects[0].cuttingWidth.bottom > 0) {
          result += 1;
        }
      });
    }

    if (this._nestedAreas.length) {
      result += this._nestedAreas.map(na => na.numberOfCuts).reduce((p, c) => p + c);
    }

    return result;
  }

  get numberOfRects() {
    let result = this._rects.length;

    if (this._nestedAreas.length) {
      result += this._nestedAreas.map(na => na.numberOfRects).reduce((p, c) => p + c);
    }

    return result;
  }

  get parent() {
    return this._parent;
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

  get rects() {
    return this._rects;
  }

  get remaining() {
    return this._remaining;
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

  get usedArea() {
    let result = 0;

    if (this._rects.length) {
      result += this._rects.map(r => r.area).reduce((p, c) => p + c);
    }

    if (this._nestedAreas.length) {
      result += this._nestedAreas.map(na => na.usedArea).reduce((p, c) => p + c);
    }

    return result;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  _getGridPosition(width, height, useCurrentHeight) {
    let posX;
    let posY;
    const usedHeight = useCurrentHeight ? this._height : this._maxHeight;

    for (let i = 0; i < usedHeight; i += 1) {
      if (i + height <= usedHeight && (!this._grid[i] || this._grid[i] + width <= this._width)) {
        posX = this._grid[i] || 0;
        posY = i;
        break;
      }
    }

    return [posX, posY];
  }

  updateGrid(posY, width, height) {
    for (let i = posY; i < posY + height; i += 1) {
      this._grid[i] = width;
      // console.log('');
    }
  }

  _setCuttings(rectOrArea) {
    const { posX, posY, width, height } = rectOrArea;
    rectOrArea.cuttingWidth = {
      right: Math.min(this._bladeWidth, this._width - (posX + width)),
      bottom: Math.min(this._bladeWidth, this._height - posY - height),
    };
  }
}
