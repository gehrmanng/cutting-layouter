import _ from 'underscore';
import uuid from 'uuid';

export default class SheetArea {
  constructor(width, height, maxHeight, bladeWidth, parent) {
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
  }

  addNestedArea(newNestedArea) {
    const [posX, posY] = this._getGridPosition(newNestedArea.fullWidth, newNestedArea.fullHeight);
    newNestedArea.posX = posX;
    newNestedArea.posY = posY;
    this._setCuttings(newNestedArea);
    this._nestedAreas.push(newNestedArea);
    this.updateGrid(posY, newNestedArea.posX + newNestedArea.fullWidth, newNestedArea.fullHeight);
  }

  addRect(newRect) {
    const [posX, posY] = this._getGridPosition(newRect.fullWidth, newRect.fullHeight);
    newRect.posX = posX;
    newRect.posY = posY;
    this._setCuttings(newRect);
    this._rects.push(newRect);
    this.updateGrid(posY, newRect.posX + newRect.fullWidth, newRect.fullHeight);
  }

  canAdd(width, height, fillRemaining) {
    const [posX, posY] = this._getGridPosition(width, height);

    const canAdd =
      posX >= 0 && posY >= 0 && (!fillRemaining || (fillRemaining && posX + width === this._width));
    return canAdd ? [posX, posY] : false;
  }

  extendHeight(height) {
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
        this.updateGrid(na.posY + na.height, na.posX + na.fullWidth, this._bladeWidth);
      }
      na.cuttingWidth = { bottom: this._bladeWidth };
      this._height += this._bladeWidth;
    } else if (this._rects && this._rects.length) {
      const maxPosY = Math.max(...this._rects.map(r => r.posY));
      const lastRects = this._rects.filter(r => r.posY === maxPosY);

      lastRects.forEach(r => {
        r.cuttingWidth = { bottom: this._bladeWidth };
        this.updateGrid(this._height, r.posX + r.fullWidth, this._bladeWidth);
      });
      this._height += this._bladeWidth;
    }

    this.updateGrid(this._height, 0, height);
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

  extendWidth(width) {
    this._width += width;

    if ((this._rects && this._rects.length) || (this._nestedAreas && this._nestedAreas.length)) {
      const byYPosition = _.groupBy([...this._rects, ...this._nestedAreas], 'posY');

      Object.values(byYPosition).forEach(collection => {
        collection.sort((l, r) => l.posX - r.posX);
        const last = _.last(collection);
        const rightCuttingWidth = Math.min(this._bladeWidth, width);
        last.cuttingWidth = { right: rightCuttingWidth };
        this.updateGrid(last.posY, last.posX + last.fullWidth, last.fullHeight);
      });
    }

    if (this._parent) {
      if (this._width === this._parent.width) {
        this._cuttingWidth.right = 0;
      }

      this._parent.updateGrid(this._posY, this._posX + this.fullWidth, this.fullHeight);
    }
  }

  getMaximumHeight(width, height) {
    const [posX, posY] = this._getGridPosition(width, height);
    if (posX >= 0 && posY >= 0) {
      return this._maxHeight - posY;
    }

    return -1;
  }

  getRemainingWidth(atHeight) {
    const remaining = this._width - this._grid[atHeight];
    return remaining;
  }

  get maxHeight() {
    return this._maxHeight;
  }

  set maxHeight(value) {
    this._maxHeight = value;
  }

  get fullHeight() {
    return this._cuttingWidth.top + this._height + this._cuttingWidth.bottom;
  }

  get fullWidth() {
    return this._cuttingWidth.left + this._width + this._cuttingWidth.right;
  }

  get cuttingWidth() {
    return this._cuttingWidth;
  }

  set cuttingWidth(newCuttingWidth) {
    this._cuttingWidth = { ...this._cuttingWidth, ...newCuttingWidth };
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

  get nestedAreas() {
    return this._nestedAreas;
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

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  _getGridPosition(width, height) {
    let posX;
    let posY;

    for (let i = 0; i < this._maxHeight; i += 1) {
      if (
        i + height <= this._maxHeight &&
        (!this._grid[i] || this._grid[i] + width <= this._width)
      ) {
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
