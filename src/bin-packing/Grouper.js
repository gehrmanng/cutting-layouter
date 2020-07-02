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
  _flatNestedAreaArrays = (area) => [
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
  group(rects, sheetArea, canRotate = true, skipOptimize) {
    const { width: sheetWidth, height: sheetHeight } = sheetArea;

    const nonFullWidthRects = rects.filter((r) => r.width < sheetWidth);
    if (nonFullWidthRects.length > 1) {
      const allHeights = new Set(nonFullWidthRects.map((r) => r.height));
      if (allHeights.size === 1 && (!this._maxSingleWidth || sheetWidth > this._maxSingleWidth)) {
        this._maxSingleWidth = sheetWidth;
      } else if (!this._maxSingleWidth) {
        this._maxSingleWidth = _.max(nonFullWidthRects.map((r) => r.width));
      }
    }

    // Group all rects by height
    const byHeight = _.groupBy(rects, 'height');

    const notAdded = [];

    // Add all full height rects to the result as long as they don't exceed the maximum width
    let hasFullHeightFullWidth = false;
    if (byHeight[sheetHeight.toString()]) {
      const fullHeightRects = byHeight[sheetHeight.toString()];
      const nonFullWidthFullHeightRects = fullHeightRects.filter((r) => r.width < sheetWidth);
      hasFullHeightFullWidth = nonFullWidthFullHeightRects.length !== fullHeightRects.length;
      const remaining = this._addFullHeightRects(
        sheetArea,
        nonFullWidthFullHeightRects,
        sheetWidth,
        sheetHeight,
      );
      notAdded.push(...remaining);
    }

    // Retrieve the remaining non full height heights
    const remainingHeights = Object.keys(byHeight)
      .map((h) => parseInt(h, 10))
      .filter((h) => h < sheetHeight || (hasFullHeightFullWidth && h === sheetHeight));

    if (!remainingHeights.length) {
      return notAdded;
    }

    const nonFullHeightRectsByHeight = {};
    remainingHeights.forEach((h) => {
      if (h === sheetHeight) {
        nonFullHeightRectsByHeight[h] = byHeight[h].filter((r) => r.width === sheetWidth);
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
    for (let i = 0; i < sheetHeight; i += 1) {
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

    const remainingNonFullSizeRects = this._addNonFullSizeRects(
      sheetArea,
      remainingRects,
      canRotate,
    );
    notAdded.push(...remainingNonFullSizeRects);

    // Optimize the dimensions of each nested area
    if (!sheetArea.parent && !skipOptimize) {
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
    const { nestedAreas, children, width: parentWidth } = parent;

    if (!nestedAreas.length) {
      return;
    }

    // eslint-disable-next-line complexity
    nestedAreas.forEach((area) => {
      const { posX, posY, rightPosition, bottomPosition, rects, width } = area;

      // Has a child below if any child starts at the same X position and has a higher Y position
      const hasBelow =
        children.filter((c) => c.posX < rightPosition && c.rightPosition > posX && c.posY > posY)
          .length > 0;
      // Has a child beside if any child starts right to the end and has a Y position between top and bottom
      const hasBeside =
        children.filter(
          (c) => c.posX >= rightPosition && c.posY >= posY && c.posY <= bottomPosition,
        ).length > 0;
      const hasMaxWidthRects =
        rects.length && rects.filter((r) => r.rightPosition === width).length > 0;
      const canExtendWidth =
        !hasBeside && (!hasMaxWidthRects || !area._grid.filter((w) => w < width).length);
      const canExtendHeight =
        !hasBelow &&
        !(
          area.rects.filter((r) => r.fullHeight === area.height).length &&
          area.children.filter((c) => c.fullHeight < area.height).length
        );

      const remainingWidth = parent.getRemainingWidth(posY);
      const remainingHeight = area.maxHeight - area.fullHeight;

      // Can only extend the width if something is below
      if (!canExtendHeight && canExtendWidth && remainingWidth > 0) {
        area.extendWidth(remainingWidth + area.cuttingWidth.right);
        area.cuttingWidth.right = 0;
      }

      // Can only extend the hight if something is beside
      if (!canExtendWidth && canExtendHeight && remainingHeight > 0) {
        area.extendHeight(remainingHeight);
        area.cuttingWidth.bottom = 0;
      }

      if (canExtendHeight && canExtendWidth) {
        // If remainingWidth is zero nothing needs to be extended
        if (
          remainingWidth > 0 &&
          (remainingWidth < remainingHeight ||
            (area.children.length > 1 &&
              new Set(area.children.map((c) => c.height)).size === 1 &&
              new Set(area.children.map((c) => c.posY)).size === 1 &&
              width >= parentWidth * 0.9))
        ) {
          // If remainingWidth is above zero but smaller than the remaining height the width should be extended
          area.extendWidth(remainingWidth + area.cuttingWidth.right);
          area.cuttingWidth.right = 0;
        } else if (remainingWidth > 0 && remainingHeight > 0) {
          // Otherwise extend the height
          area.extendHeight(remainingHeight);
          area.cuttingWidth.bottom = 0;
        }
      }

      if (!canExtendHeight && area.fullHeight < area.maxHeight && area.fullWidth < parentWidth) {
        area.extendToMaxHeight();
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
    Sorter.sort(rects).forEach((rect) => {
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
      (r) =>
        r.width === remainingWidth ||
        (r.width + this._bladeWidth >= remainingWidth &&
          r.width + this._bladeWidth <= remainingWidth + this._bladeWidth),
    );

    const remainingRects = allRects.filter(
      (r) => !fullWidthRects.length || !fullWidthRects.map((fr) => fr.id).includes(r.id),
    );
    if (remainingRects.length) {
      notAdded.push(...remainingRects);
    }

    Sorter.sort(fullWidthRects).forEach((rect) => {
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
  _addNonFullSizeRects(sheetArea, remainingRects, canRotate) {
    const notAddedRects = [];

    const sorted = Sorter.sort(remainingRects);
    sorted.forEach((rect, index) => {
      const { width, height, sheet } = rect;

      // Rect has already been assigned to a sheet
      if (typeof sheet !== 'undefined') {
        return;
      }

      if (width < this._maxSingleWidth) {
        const sameHeight = sorted
          .slice(index + 1)
          .filter((r) => r.height === height && typeof r.sheet === 'undefined');
        if (sameHeight.length) {
          let combinedWidth = width;
          const combined = [rect];
          const maxAllowedWidth = Math.min(sheetArea.width, this._maxSingleWidth * 1.2);
          for (const shr of sameHeight) {
            if (combinedWidth + this._bladeWidth + shr.width <= maxAllowedWidth) {
              combinedWidth = combinedWidth + this._bladeWidth + shr.width;

              const existingNestedArea = this._findNestedArea(
                combinedWidth,
                height,
                sheetArea.nestedAreas,
              );

              if (existingNestedArea || sheetArea.canAdd(combinedWidth, height)) {
                combined.push(shr);
                if (combinedWidth >= this._maxSingleWidth) {
                  break;
                }
              } else {
                combinedWidth = combinedWidth - this._bladeWidth - shr.width;
              }
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
              if (canRotate) {
                const stillRemaining = this._rotateAndTryAgain(notAddedSingleRect, sheetArea);
                notAddedRects.push(...stillRemaining);
              } else {
                notAddedRects.push(...notAddedSingleRect);
              }
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
        if (canRotate) {
          const stillRemaining = this._rotateAndTryAgain(notAddedSingleRect, sheetArea);
          notAddedRects.push(...stillRemaining);
        } else {
          notAddedRects.push(...notAddedSingleRect);
        }
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
      const combined = this._combineAreas(
        existingNestedArea.posX,
        existingNestedArea.posY,
        existingNestedArea.width,
        existingNestedArea.height,
        [...SheetArea.getRects(existingNestedArea), ...rects],
        existingNestedArea.parent,
      );

      if (combined) {
        existingNestedArea.parent.removeNestedArea(existingNestedArea);
      } else {
        const coords = existingNestedArea.canAdd(width, height, true);
        const removedRects = existingNestedArea.removeChildren(coords, width);
        rects.forEach((r) => {
          existingNestedArea.addRect(r);
        });
        this._addRemovedRects(removedRects, existingNestedArea);
      }
    } else if (
      existingNestedArea &&
      existingNestedArea.width >= width &&
      existingNestedArea.extendHeight(
        rects.length > 1 ? height : undefined,
        rects.length === 1 ? rects[0] : undefined,
      )
    ) {
      const combined = this._combineAreas(
        existingNestedArea.posX,
        existingNestedArea.posY,
        existingNestedArea.width,
        existingNestedArea.height,
        [...SheetArea.getRects(existingNestedArea), ...rects],
        existingNestedArea.parent,
      );

      if (combined) {
        existingNestedArea.parent.removeNestedArea(existingNestedArea);
      } else {
        // Add rects to an existing area if the area has at least the same width and
        // can be extended in its height
        const notGroupedRects = this.group(rects, existingNestedArea);
        if (notGroupedRects.length) {
          notAddedRects.push(...notGroupedRects);
        }
      }
    } else if (parent) {
      if (parent.canAdd(width, height, true)) {
        const coords = parent.canAdd(width, height, true);
        if (coords[0] > 0) {
          const combined = this._combineAreas(coords[0], coords[1], width, height, rects, parent);
          if (combined) {
            return notAddedRects;
          }
        }
        parent.extendHeight(undefined, rects[0]);
        const removedRects = parent.removeChildren(coords, width);
        rects.forEach((r) => {
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

      const [newPosX, newPosY] = coords;

      if (newPosX > 0) {
        const combined = this._combineAreas(
          newPosX,
          newPosY,
          newNestedArea.width,
          height,
          rects,
          parent,
        );
        if (combined) {
          return notAddedRects;
        }
      }

      // Extend the parent height and add the new area
      parent.extendHeight(undefined, newNestedArea);
      if (newPosY > 0) {
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
   * Combine already positioned rects with a left sibling if available.
   *
   * @param {number} posX The previously calculated X position
   * @param {number} posY The previously calculated Y position
   * @param {number} width The full width of the given rects
   * @param {number} height The height of the given rects
   * @param {Array.<Rect>} rects The rects that should be combined with a sibling
   * @param {SheetArea} parent The parent sheet area
   * @return {boolean} True if the rects could be combined with a sibling, false otherwise
   */
  _combineAreas(posX, posY, width, height, rects, parent) {
    const leftSiblings = parent.children.filter(
      (c) =>
        c.rightPosition === posX &&
        c.posY === posY &&
        c.height >= height &&
        c.height <= height + this._bladeWidth,
    );
    if (leftSiblings.length === 1 && leftSiblings[0] instanceof SheetArea) {
      const leftSibling = leftSiblings.pop();
      const removedChildren = leftSibling.removeChildren();
      const newChildren = [...removedChildren, ...rects];
      leftSibling.extendWidth(this._bladeWidth + width);
      newChildren.forEach((r) => {
        r.reset();
      });
      this.group(newChildren, leftSibling);
      return true;
    }

    return false;
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

    removedRects.forEach((r) => {
      r.reset();
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
      .filter((na) => na.height === height && na.parent.getRemainingWidth(na.posY) >= width)
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    // Find first level nested areas with the same width and enough remaining height
    matchingNestedArea = availableNestedAreas
      .filter((na) => na.width === width && na.canAdd(width, height, true))
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    const hasNestedAreas = availableNestedAreas.filter(
      (na) => na.nestedAreas && na.nestedAreas.length,
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
      .filter((na) => na.width >= width && na.canAdd(width, height))
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

  _rotateAndTryAgain(rects, sheetArea) {
    let parent;
    while (sheetArea.parent) {
      parent = sheetArea.parent;
    }
    if (!parent) {
      parent = sheetArea;
    }

    const rotatable = rects.filter((r) => r.width <= parent.height);
    rotatable.forEach((r) => {
      r.rotate();
    });

    const stillRemaining = this.group(rotatable, parent, false, true);
    stillRemaining.forEach((r) => {
      r.rotate();
    });

    return [
      ...stillRemaining,
      ...rects.filter((r) => !rotatable.map((rot) => rot.id).includes(r.id)),
    ];
  }
}
