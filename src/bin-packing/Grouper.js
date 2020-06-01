/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
// Library imports
import _ from 'underscore';

// Local data object imports
import SheetArea from './SheetArea';
import Sorter from './Sorter';

/**
 * A grouper for layout rects.
 */
export default class Grouper {
  /**
   * Get a flattened array of all nested areas.
   *
   * @param {SheetArea} area The parent area
   */
  _flatNestedAreaArrays = area => [
    area,
    ...(area.nestedAreas || []).flatMap(this._flatNestedAreaArrays),
  ];

  /**
   * Constructor.
   *
   * @param {number} bladeWidth The blade width
   */
  constructor(bladeWidth) {
    this._bladeWidth = bladeWidth;
  }

  /**
   * Group as many given rects as possible into the given sheet area.
   *
   * @param {Array.<Rect>} rects All layout rects that should be grouped
   * @param {SheetArea} sheetArea The sheet area where the rects should be grouped within
   * @param {boolean} [canRotate=true] Flag indicating if rect rotation is allowed
   */
  group(rects, sheetArea, canRotate = true) {
    const { width: fullWidth, height: fullHeight } = sheetArea;

    if (!this._maxSingleWidth) {
      const nonFullWidthRects = rects.filter(r => r.width < fullWidth);
      if (nonFullWidthRects.length > 1) {
        const allHeights = new Set(nonFullWidthRects.map(r => r.height));
        if (allHeights.size === 1) {
          this._maxSingleWidth = fullWidth;
        } else {
          this._maxSingleWidth = _.max(nonFullWidthRects.map(r => r.width));
        }
      }
    }

    // Group all rects by height
    const byHeight = _.groupBy(rects, 'height');

    const notAdded = [];

    // Add all full height rects to the result as long as they don't exceed the maximum width
    let hasFullHeightFullWidth = false;
    if (byHeight[fullHeight.toString()]) {
      const fullHeightRects = byHeight[fullHeight.toString()];
      const nonFullWidthRects = fullHeightRects.filter(r => r.width < fullWidth);
      hasFullHeightFullWidth = nonFullWidthRects.length !== fullHeightRects;
      const remaining = this._addFullHeightRects(
        sheetArea,
        nonFullWidthRects,
        fullWidth,
        fullHeight,
      );
      notAdded.push(...remaining);
    }

    // Retrieve the remaining non full height heights
    const remainingHeights = Object.keys(byHeight)
      .map(h => parseInt(h, 10))
      .filter(h => h < fullHeight || (hasFullHeightFullWidth && h === fullHeight));

    if (!remainingHeights.length) {
      return notAdded;
    }

    const nonFullHeightRectsByHeight = {};
    remainingHeights.forEach(h => {
      if (h === fullHeight) {
        nonFullHeightRectsByHeight[h] = byHeight[h].filter(r => r.width === fullWidth);
      } else {
        nonFullHeightRectsByHeight[h] = byHeight[h];
      }
    });

    const remainingRects = this._addFullRemainingWidthRects(sheetArea, nonFullHeightRectsByHeight);

    if (!remainingRects.length) {
      return notAdded;
    }

    let remainingPosY = -1;
    let remainingWidth;
    for (let i = 0; i < fullHeight; i += 1) {
      remainingWidth = sheetArea.getRemainingWidth(i);
      if (remainingWidth > 0) {
        remainingPosY = i;
        break;
      }
    }
    if (remainingPosY < 0) {
      notAdded.push(...remainingRects);
      return notAdded;
    }

    const remainingNonFullSizeRects = this._addNonFullSizeRects(sheetArea, remainingRects);
    notAdded.push(...remainingNonFullSizeRects);

    // Optimize the dimensions of each nested area
    if (!sheetArea.parent) {
      this._optimizeNestedAreaDimensions(sheetArea);
    }

    return notAdded;
  }

  /**
   * Optimize the dimensions of all nested areas of the given sheet area by extending their width or
   * height.
   *
   * @param {SheetArea} parent The parent sheet area
   */
  _optimizeNestedAreaDimensions(parent) {
    const { nestedAreas, children } = parent;

    if (!nestedAreas.length) {
      return;
    }

    // eslint-disable-next-line complexity
    nestedAreas.forEach(area => {
      const { posX, posY, rightPosition, bottomPosition, rects, width } = area;

      // Has a child below if any child starts at the same X position and has a higher Y position
      const hasBelow = children.filter(c => c.posX === posX && c.posY > posY).length > 0;
      // Has a child beside if any child starts right to the end and has a Y position between top and bottom
      const hasBeside =
        children.filter(c => c.posX >= rightPosition && c.posY >= posY && c.posY <= bottomPosition)
          .length > 0;
      const hasMaxWidthRects =
        rects.length && rects.filter(r => r.rightPosition === width).length > 0;
      const canExtendWidth =
        !hasBeside && (!hasMaxWidthRects || !area._grid.filter(w => w < width).length);

      const remainingWidth = parent.getRemainingWidth(posY);
      const remainingHeight = area.maxHeight - area.fullHeight;

      // Can only extend the width if something is below
      if (hasBelow && canExtendWidth && remainingWidth > 0) {
        area.extendWidth(remainingWidth + area.cuttingWidth.right);
        area.cuttingWidth.right = 0;
      }

      // Can only extend the hight if something is beside
      if (!canExtendWidth && !hasBelow && remainingHeight > 0) {
        area.extendHeight(remainingHeight);
        area.cuttingWidth.bottom = 0;
      }

      if (!hasBelow && canExtendWidth) {
        // If remainingWidth is zero nothing needs to be extended
        if (remainingWidth > 0 && remainingWidth < remainingHeight) {
          // If remainingWidth is above zero but smaller than the remaining height the width should be extended
          area.extendWidth(remainingWidth + area.cuttingWidth.right);
          area.cuttingWidth.right = 0;
        } else if (remainingWidth > 0 && remainingHeight > 0) {
          // Otherwise extend the height
          area.extendHeight(remainingHeight);
          area.cuttingWidth.bottom = 0;
        }
      }

      // Re-run the optimization for any nested areas
      if (area.nestedAreas && area.nestedAreas.length) {
        this._optimizeNestedAreaDimensions(area);
      }
    });
  }

  /**
   * Add all full height rects to the given sheet area as long as they don't exceed the maximum width.
   *
   * @param {SheetArea} sheetArea The sheet area to add full height rects to
   * @param {Array.<Rect>} rects The rects to be added
   */
  _addFullHeightRects(sheetArea, rects) {
    const notAdded = [];
    Sorter.sort(rects).forEach(rect => {
      // Add the rect if there is enough remaining width at the very first row
      if (sheetArea.getRemainingWidth(0) >= rect.width) {
        sheetArea.addRect(rect);
      } else {
        notAdded.push(rect);
      }
    });

    return notAdded;
  }

  /**
   * Add all rects that fill the maximum remaining width.
   *
   * @param {SheetArea} sheetArea The object to add full width rects to
   * @param {object} rectsByHeight All available rects grouped by their height
   */
  _addFullRemainingWidthRects(sheetArea, rectsByHeight) {
    const notAdded = [];

    // Get first available posY
    let remainingWidth = sheetArea.getRemainingWidth(0);
    if (remainingWidth === 0) {
      for (let i = 1; i < sheetArea.height; i += 1) {
        remainingWidth = sheetArea.getRemainingWidth(i);
        if (remainingWidth > 0) {
          break;
        }
      }
    }

    const allRects = Object.values(rectsByHeight).flat();
    const fullWidthRects = allRects.filter(
      r => r.width === remainingWidth || r.width + this._bladeWidth >= remainingWidth,
    );

    const remainingRects = allRects.filter(
      r => !fullWidthRects.length || !fullWidthRects.map(fr => fr.id).includes(r.id),
    );
    if (remainingRects.length) {
      notAdded.push(...remainingRects);
    }

    Sorter.sort(fullWidthRects).forEach(rect => {
      if (
        sheetArea.canAdd(rect.width, rect.height, true) &&
        sheetArea.extendHeight(undefined, rect)
      ) {
        sheetArea.addRect(rect);
      } else {
        notAdded.push(rect);
      }
    });

    return notAdded;
  }

  /**
   * Add as many remaining rects that do neither fill the full height nor the full width.
   *
   * @param {SheetArea} sheetArea The sheet area to add new rects to
   * @param {object} groupsByHeight All remaining rects grouped by their height and the maximum
   *                                available width
   */
  _addNonFullSizeRects(sheetArea, remainingRects) {
    const notAddedRects = [];

    const sorted = Sorter.sort(remainingRects);
    sorted.forEach((rect, index) => {
      const { width, height, sheet } = rect;

      // Rect has already been assigned to a sheet
      if (typeof sheet !== 'undefined') {
        return;
      }

      if (width < this._maxSingleWidth) {
        const sameHeight = sorted.slice(index + 1).filter(r => r.height === height);
        if (sameHeight.length) {
          let combinedWidth = width;
          const combined = [rect];
          const maxAllowedWidth = Math.min(sheetArea.width, this._maxSingleWidth * 1.2);
          for (const shr of sameHeight) {
            if (combinedWidth + this._bladeWidth + shr.width <= maxAllowedWidth) {
              combinedWidth = combinedWidth + this._bladeWidth + shr.width;
              combined.push(shr);
            }
          }

          if (combined.length > 1) {
            const existingNestedArea = this._findNestedArea(
              combinedWidth,
              height,
              sheetArea.nestedAreas,
            );
            const notAddedSingleRect = this._addToArea(
              combinedWidth,
              height,
              combined,
              sheetArea,
              existingNestedArea,
            );
            if (notAddedSingleRect.length) {
              notAddedRects.push(...notAddedSingleRect);
            }

            return;
          }
        }
      }

      // Get an existing area that the current rect can be added to
      const existingNestedArea = this._findNestedArea(width, height, sheetArea.nestedAreas);
      const notAddedSingleRect = this._addToArea(
        width,
        height,
        [rect],
        sheetArea,
        existingNestedArea,
      );
      if (notAddedSingleRect.length) {
        notAddedRects.push(...notAddedSingleRect);
      }
    });

    return notAddedRects;
  }

  /**
   * Add as many of the given rects either to a given existing sheet area or to a new one.
   *
   * @param {number} width The width of the given rects
   * @param {number} height The height of the given rects
   * @param {Array.<Rect>} rects The rects that should be added
   * @param {SheetArea} [parent] The parent sheet area
   * @param {SheetArea} [existingNestedArea] The sheet area that the given rects should be added to
   */
  // eslint-disable-next-line complexity
  _addToArea(width, height, rects, parent, existingNestedArea) {
    const notAddedRects = [];

    if (
      existingNestedArea &&
      existingNestedArea.width >= width &&
      existingNestedArea.canAdd(width, height, true) &&
      existingNestedArea.extendHeight(undefined, { width, height })
    ) {
      const coords = existingNestedArea.canAdd(width, height, true);
      const removedRects = existingNestedArea.removeChildren(coords, width);
      rects.forEach(r => {
        existingNestedArea.addRect(r);
      });
      this._addRemovedRects(removedRects, existingNestedArea);
    } else if (
      existingNestedArea &&
      existingNestedArea.width >= width &&
      existingNestedArea.extendHeight(
        rects.length > 1 ? height : undefined,
        rects.length === 1 ? rects[0] : undefined,
      )
    ) {
      // Add rects to an existing area if the area has at least the same width and
      // can be extended in its height
      const notGroupedRects = this.group(rects, existingNestedArea);
      if (notGroupedRects.length) {
        notAddedRects.push(...notGroupedRects);
      }
    } else if (parent) {
      if (parent.canAdd(width, height, true)) {
        const coords = parent.canAdd(width, height, true);
        parent.extendHeight(undefined, rects[0]);
        const removedRects = parent.removeChildren(coords, width);
        rects.forEach(r => {
          parent.addRect(r);
        });
        this._addRemovedRects(removedRects, parent);
      } else {
        // Add rects to a new area if a parent area is available
        const notAddedToNestedArea = this._addToNewNestedArea(width, height, parent, rects);
        if (notAddedToNestedArea.length) {
          notAddedRects.push(...notAddedToNestedArea);
        }
      }
    }

    return notAddedRects;
  }

  /**
   * Try to add the given rects to a new nested area of given width and height.
   *
   * @param {number} width The width of the new area
   * @param {number} height The height of the new area
   * @param {SheetArea} parent The parent area
   * @param {Array.<Rect>} rects The rects that should be added to the new area
   */
  _addToNewNestedArea(width, height, parent, rects) {
    const notAddedRects = [];

    // Get the maximum available height of the parent area
    const maxHeight = parent.getMaximumHeight(width, height);

    if (maxHeight >= height) {
      // Create the new area and group the rects into it
      let newNestedArea = new SheetArea(
        width,
        height,
        maxHeight,
        this._bladeWidth,
        parent,
        parent.sheet,
      );

      const notGroupedRects = this.group(rects, newNestedArea);
      if (notGroupedRects.length) {
        notAddedRects.push(...notGroupedRects);
      }

      // Check if the new area really can be added to the parent (should always return true).
      const coords = parent.canAdd(
        newNestedArea.fullWidth,
        newNestedArea.fullHeight,
        false,
        false,
        true,
      );

      if (!coords) {
        throw new Error('Something went wrong');
      }

      // Extend the parent height and add the new area
      parent.extendHeight(undefined, newNestedArea);
      if (coords[1] > 0) {
        const removedRects = parent.removeChildren(coords, newNestedArea.width);
        newNestedArea = parent.addNestedArea(newNestedArea);
        newNestedArea.maxHeight = parent.maxHeight - newNestedArea.posY;
        this._addRemovedRects(removedRects, newNestedArea);
      } else {
        parent.addNestedArea(newNestedArea);
      }
    } else {
      // It was neither possible to add any of the given rects
      // to an existing area nor to a new one.
      notAddedRects.push(...rects);
    }

    return notAddedRects;
  }

  /**
   * Add previously removed rects to the given parent area.
   *
   * @param {Array.<Rect>} removedRects Previously removed rects
   * @param {SheetArea} parent The new parent
   */
  _addRemovedRects(removedRects, parent) {
    if (!removedRects.length) {
      return;
    }

    removedRects.forEach(r => {
      r.sheet = undefined;
    });
    this._addNonFullSizeRects(parent, removedRects);
  }

  /**
   * Find a nested sheet area the can hold the given width and height.
   *
   * @param {number} width The required width
   * @param {number} height The minimum required height
   * @param {Array.<SheetArea>} availableNestedAreas All available nested areas
   * @param {boolean} sameWidthOnly Flag indicating if a nested area with the exact given width needs
   *                                to be returned
   */
  _findNestedArea(width, height, availableNestedAreas, sameWidthOnly) {
    if (!availableNestedAreas || !availableNestedAreas.length) {
      return undefined;
    }

    // Find first level nested area of same height with enough remaining space next to it
    let matchingNestedArea = availableNestedAreas
      .filter(na => na.height === height && na.parent.getRemainingWidth(na.posY) >= width)
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    // Find first level nested areas with the same width and enough remaining height
    matchingNestedArea = availableNestedAreas
      .filter(na => na.width === width && na.canAdd(width, height, true))
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    const hasNestedAreas = availableNestedAreas.filter(
      na => na.nestedAreas && na.nestedAreas.length,
    );

    // Find deeper level nested areas with the same width and enough remaining height
    for (const na of hasNestedAreas) {
      matchingNestedArea = this._findNestedArea(width, height, na.nestedAreas, true);
      if (matchingNestedArea) {
        break;
      }
    }

    if (matchingNestedArea || sameWidthOnly) {
      return matchingNestedArea;
    }

    // Find bigger first level nested area
    matchingNestedArea = availableNestedAreas
      .filter(na => na.width >= width && na.canAdd(width, height))
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    // Find bigger deeper level nested areas
    for (const na of hasNestedAreas) {
      matchingNestedArea = this._findNestedArea(width, height, na.nestedAreas);
      if (matchingNestedArea) {
        break;
      }
    }

    return matchingNestedArea;
  }
}
