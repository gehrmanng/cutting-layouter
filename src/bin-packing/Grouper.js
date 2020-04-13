/* eslint-disable class-methods-use-this */
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
   * @param {Rect[]} rects All layout rects that should be grouped
   * @param {SheetArea} sheetArea The sheet area where the rects should be grouped within
   * @param {boolean} [canRotate=true] Flag indicating if rect rotation is allowed
   */
  group(rects, sheetArea, canRotate = true) {
    const { width: fullWidth, height: fullHeight } = sheetArea;
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

    const remainingRects = this._addMaxWidthGroups(sheetArea, nonFullHeightRectsByHeight);

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
   * Optimize the dimensions of all nested areas of the given sheet area
   * by extending their width or height.
   *
   * @param {SheetArea} parent The parent sheet area
   */
  _optimizeNestedAreaDimensions(parent) {
    const { nestedAreas, children } = parent;

    if (!nestedAreas.length) {
      return;
    }

    nestedAreas.forEach(area => {
      const { posX, posY, rightPosition, bottomPosition } = area;

      // Has a child below if any child starts at the same X position and has a higher Y position
      const hasBelow = children.filter(c => c.posX === posX && c.posY > posY).length > 0;
      // Has a child beside if any child starts right to the end and has a Y position between top and bottom
      const hasBeside =
        children.filter(c => c.posX >= rightPosition && c.posY >= posY && c.posY <= bottomPosition)
          .length > 0;

      const remainingWidth = parent.getRemainingWidth(posY);
      const remainingHeight = area.maxHeight - area.fullHeight;

      // Can only extend the width if something is below
      if (hasBelow && !hasBeside && remainingWidth > 0) {
        area.extendWidth(remainingWidth + area.cuttingWidth.right);
        area.cuttingWidth.right = 0;
      }

      // Can only extend the hight if something is beside
      if (hasBeside && !hasBelow && remainingHeight > 0) {
        area.extendHeight(remainingHeight);
        area.cuttingWidth.bottom = 0;
      }

      if (!hasBelow && !hasBeside) {
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
   * @param {Rect[]} rects The rects to be added
   */
  _addFullHeightRects(sheetArea, rects) {
    const notAdded = [];
    rects.forEach(rect => {
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
   * Group all given rects bei their height to fit into the given maximum width.
   *
   * @param {Rect[]} rects The rects to be grouped
   * @param {number} width The maximum available width
   */
  _groupByMaxWidths(rects, width) {
    const grouped = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const rect of rects) {
      let added = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const group of grouped) {
        if (group.width + this._bladeWidth + rect.width <= width) {
          group.rects.push(rect);
          group.width += this._bladeWidth + rect.width;
          if (rect.width > group.maxSingleWidth) {
            group.maxSingleWidth = rect.width;
          }
          added = true;
          break;
        }
      }
      if (!added) {
        grouped.push({ width: rect.width, maxSingleWidth: rect.width, rects: [rect] });
      }
    }

    grouped.sort((l, r) => r.width - l.width);
    return grouped;
  }

  /**
   * Group all non full height rects by their height. Rects with the same height
   * are additionally grouped to at most fill the max sheet width.
   *
   * @param {object} rectsByHeight All available rects grouped by their height
   * @param {number} fullWidth The maximum available width
   */
  _groupByHeight(rectsByHeight, fullWidth) {
    const groupedByHeight = {};

    Object.entries(rectsByHeight).forEach(([key, rects]) => {
      const groupedByWidth = this._groupByMaxWidths(rects, fullWidth);
      groupedByHeight[parseInt(key, 10)] = groupedByWidth;
    });

    return groupedByHeight;
  }

  /**
   * Add all rects that fill the maximum remaining width.
   *
   * @param {SheetArea} sheetArea The object to add full width rects to
   * @param {object} rectsByHeight All available rects grouped by their height
   */
  _addMaxWidthGroups(sheetArea, rectsByHeight) {
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

    fullWidthRects.forEach(rect => {
      if (
        sheetArea.canAdd(rect.width, rect.height, true) &&
        sheetArea.extendHeight(undefined, rect)
      ) {
        sheetArea.addRect(rect);
      } else {
        notAdded.push(rect);
      }
    });

    // const groupedByHeight = this._groupByHeight(rectsByHeight, remainingWidth);

    // const sortedHeights = Object.keys(groupedByHeight)
    //   .map(h => parseInt(h, 10))
    //   .sort((l, r) => r - l);

    // sortedHeights.forEach(height => {
    //   const groupsOfHeight = groupedByHeight[height];
    //   groupsOfHeight.sort((l, r) => {
    //     let result = r.width - l.width;
    //     if (result === 0) {
    //       result = l.rects.length - r.rects.length;
    //     }

    //     return result;
    //   });

    //   groupsOfHeight.forEach(group => {
    //     const coords = sheetArea.canAdd(group.width, height, true);
    //     if (coords) {
    //       const [, posY] = coords;
    //       const localRemainingWidth = sheetArea.getRemainingWidth(posY);
    //       if (Number.isNaN(localRemainingWidth)) {
    //         sheetArea.extendHeight(undefined, group.rects[0]);
    //       }
    //       group.rects.sort((l, r) => l.width - r.width);
    //       group.rects.forEach(r => sheetArea.addRect(r));
    //     } else {
    //       notAdded.push(...group.rects);
    //     }
    //   });
    // });

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

      if (typeof sheet !== 'undefined') {
        return;
      }

      const remainingSameHeight = sorted.slice(index).filter(r => r.height === height);
      const grouped = this._groupByMaxWidths(remainingSameHeight, sheetArea.width);

      if (grouped.length) {
        let added = false;
        grouped.forEach(group => {
          if (sheetArea.canAdd(group.width, height, true)) {
            group.rects.forEach(r => sheetArea.addRect(r));
            added = true;
          }
        });

        if (added) {
          return;
        }
      }

      if (sheetArea.parent && sheetArea.canAdd(width, height)) {
        const coords = sheetArea.canAdd(width, height);
        if (sheetArea.rects.filter(r => r.posX === coords[0] && r.width === width).length > 0) {
          sheetArea.addRect(rect);
          return;
        }
      }

      const existingNestedArea = this._findNestedArea(width, width, height, sheetArea.nestedAreas);

      if (
        existingNestedArea &&
        existingNestedArea.height === height &&
        existingNestedArea.parent.getRemainingWidth(existingNestedArea.posY) >= width
      ) {
        existingNestedArea.extendWidth(width + this._bladeWidth);
        const notGroupedRects = this.group([rect], existingNestedArea);
        if (notGroupedRects.length) {
          notAddedRects.push(...notGroupedRects);
        }
      } else if (existingNestedArea && existingNestedArea.canAdd(width, height, false, true)) {
        const notGroupedRects = this.group([rect], existingNestedArea);
        if (notGroupedRects.length) {
          notAddedRects.push(...notGroupedRects);
        }
      } else if (
        existingNestedArea &&
        existingNestedArea.width >= width &&
        existingNestedArea.extendHeight(undefined, rect)
      ) {
        const notGroupedRects = this.group([rect], existingNestedArea);
        if (notGroupedRects.length) {
          notAddedRects.push(...notGroupedRects);
        }
      } else {
        const maxHeight = sheetArea.getMaximumHeight(width, height);

        if (maxHeight >= height) {
          const newNestedArea = new SheetArea(
            width,
            height,
            maxHeight,
            this._bladeWidth,
            sheetArea,
          );
          const notGroupedRects = this.group([rect], newNestedArea);
          if (notGroupedRects.length) {
            notAddedRects.push(...notGroupedRects);
          }

          const canAdd = sheetArea.canAdd(newNestedArea.fullWidth, newNestedArea.fullHeight);

          if (!canAdd) {
            throw new Error('Something went wrong');
          }

          // if (sheetArea.height < posY) {
          //   sheetArea.extendHeight(newNestedArea.fullHeight);
          // }
          sheetArea.addNestedArea(newNestedArea);
        } else {
          notAddedRects.push(rect);
        }
      }
    });

    return notAddedRects;
  }

  /**
   * Find a nested sheet area the can hold the given width and height.
   *
   * @param {number} width The required width
   * @param {number} maxSingleWidth The maximum single rect width as an alternative to the full width
   * @param {number} height The minimum required height
   * @param {SheetArea[]} availableNestedAreas All available nested areas
   * @param {boolean} sameWidthOnly Flag indicating if a nested area with the exact given width needs to be returned
   */
  _findNestedArea(width, maxSingleWidth, height, availableNestedAreas, sameWidthOnly) {
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

    // Find first level nested areas which have the same width as the widest single rect
    matchingNestedArea = availableNestedAreas
      .filter(na => na.width === maxSingleWidth && na.canAdd(maxSingleWidth, height, true))
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    const hasNestedAreas = availableNestedAreas.filter(
      na => na.nestedAreas && na.nestedAreas.length,
    );

    // Find deeper level nested areas with the same width and enough remaining height
    // eslint-disable-next-line no-restricted-syntax
    for (const na of hasNestedAreas) {
      matchingNestedArea = this._findNestedArea(
        width,
        maxSingleWidth,
        height,
        na.nestedAreas,
        true,
      );
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

    // Find bigger first level nested areas which can hold the widest single rect
    matchingNestedArea = availableNestedAreas
      .filter(na => na.width >= maxSingleWidth && na.canAdd(maxSingleWidth, height))
      .pop();

    if (matchingNestedArea) {
      return matchingNestedArea;
    }

    // Find bigger deeper level nested areas
    // eslint-disable-next-line no-restricted-syntax
    for (const na of hasNestedAreas) {
      matchingNestedArea = this._findNestedArea(width, maxSingleWidth, height, na.nestedAreas);
      if (matchingNestedArea) {
        break;
      }
    }

    return matchingNestedArea;
  }
}
