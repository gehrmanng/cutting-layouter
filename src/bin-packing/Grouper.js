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
   * @param {Array.<Rect>} rects All layout rects that should be grouped
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
   * @param {Array.<Rect>} rects The rects to be added
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

    return notAdded;
  }

  /**
   * Group all given rects bei their height to fit into the given maximum width.
   *
   * @param {Array.<Rect>} rects The rects to be grouped
   * @param {number} width The maximum available width
   */
  _groupByMaxWidths(rects, width) {
    const grouped = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const rect of rects) {
      let added = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const group of grouped) {
        if (!width || group.width + this._bladeWidth + rect.width <= width) {
          group.rects.push(rect);
          group.width += this._bladeWidth + rect.width;
          added = true;
          break;
        }
      }
      if (!added) {
        grouped.push({ width: rect.width, rects: [rect] });
      }
    }

    grouped.sort((l, r) => r.width - l.width);
    return grouped;
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

      // Get all remaining rects that have the same height
      const remaining = sorted.slice(index + 1);
      const sameHeight = [rect, ...remaining.filter(r => r.height === height)];

      if (sameHeight.length > 1) {
        // Try to add to an existing area first
        const addedCurrentRect = this._addSameHeightRectsToNestedArea(
          rect.id,
          sameHeight,
          height,
          sheetArea.nestedAreas,
        );
        if (addedCurrentRect) {
          return;
        }

        // Group all rects with the same height and get the group that contains the current rect
        const sameHeightAsRect = this._groupByMaxWidths(sameHeight, sheetArea.width)
          .filter(g => g.rects.map(r => r.id).includes(rect.id))
          .pop();

        if (sameHeightAsRect) {
          // Add all grouped rects directly if the group fills the full sheet area width
          if (sheetArea.canAdd(sameHeightAsRect.width, height, true)) {
            sameHeightAsRect.rects.forEach(r => sheetArea.addRect(r));
            return;
          }

          // Otherwise try to add the group to a new sheet area
          this._addToArea(sameHeightAsRect.width, height, sameHeightAsRect.rects, sheetArea);

          if (typeof rect.sheet !== 'undefined') {
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
  _addToArea(width, height, rects, parent, existingNestedArea) {
    const notAddedRects = [];

    if (
      existingNestedArea &&
      existingNestedArea.height === height &&
      existingNestedArea.canExtendWidth(width)
    ) {
      // Add rects to an existing area if the area has the same height and
      // can be extended in its width
      existingNestedArea.extendWidth(width + this._bladeWidth);
      const notGroupedRects = this.group(rects, existingNestedArea);
      if (notGroupedRects.length) {
        notAddedRects.push(...notGroupedRects);
      }
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
      // Add rects to a new area if a parent area is available

      // Get the maximum available height of the parent area
      const maxHeight = parent.getMaximumHeight(width, height);

      if (maxHeight >= height) {
        // Create the new area and group the rects into it
        const newNestedArea = new SheetArea(
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
        const canAdd = parent.canAdd(newNestedArea.fullWidth, newNestedArea.fullHeight);

        if (!canAdd) {
          throw new Error('Something went wrong');
        }

        // Extend the parent height and add the new area
        parent.extendHeight(undefined, newNestedArea);
        parent.addNestedArea(newNestedArea);
      } else {
        // It was neither possible to add any of the given rects
        // to an existing area nor to a new one.
        notAddedRects.push(...rects);
      }
    }

    return notAddedRects;
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
    // eslint-disable-next-line no-restricted-syntax
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
    // eslint-disable-next-line no-restricted-syntax
    for (const na of hasNestedAreas) {
      matchingNestedArea = this._findNestedArea(width, height, na.nestedAreas);
      if (matchingNestedArea) {
        break;
      }
    }

    return matchingNestedArea;
  }

  /**
   * Try to add the currently processed rect together with same height rects to one of the given
   * nested sheet areas.
   *
   * @param {string} currentId The id of the currently processed rect
   * @param {Array.<Rect>} rects All remaining rects with the same height as the current rect
   * @param {number} height The height of the current rect
   * @param {Array.<SheetArea>} availableNestedAreas All available nested sheet areas
   */
  _addSameHeightRectsToNestedArea(currentId, rects, height, availableNestedAreas) {
    // At least two rects are required
    if (rects.length < 2 || !availableNestedAreas.length) {
      return false;
    }

    // Check that all rects have the same height
    const heights = new Set(rects.map(r => r.height));
    if (heights.length > 1) {
      throw new Error('Expected all rects to have the same height');
    }

    // Flat all nested areas, group them by their width and extract the maximum width
    const areasByWidth = _.groupBy(
      availableNestedAreas.flatMap(this._flatNestedAreaArrays),
      'width',
    );
    const areaWidths = Object.keys(areasByWidth);
    const maxAreaWidth = _.max(areaWidths);

    // Group all given rects to fit into the widest area and
    // get the group that contains the currently processed rect
    const group = this._groupByMaxWidths(rects, maxAreaWidth)
      .filter(g => g.rects.map(r => r.id).includes(currentId) && g.rects.length > 1)
      .pop();
    if (!group) {
      return false;
    }

    const groupWidth = group.width;
    // Check if the grouped rects also fit into a smaller area
    const otherMatchingWidths = areaWidths.filter(w => w !== maxAreaWidth && w > groupWidth);

    let nestedArea;
    // Get the matching nested area
    if (otherMatchingWidths.length) {
      [nestedArea] = areasByWidth[_.min(otherMatchingWidths)];
    } else {
      [nestedArea] = areasByWidth[maxAreaWidth];
    }

    let notAdded;
    // Add the group of rects directly to the nested area if it has the same width as
    // the area, otherwise use the area as the parent
    if (nestedArea.width === groupWidth) {
      notAdded = this._addToArea(groupWidth, height, group.rects, undefined, nestedArea);
    } else {
      notAdded = this._addToArea(groupWidth, height, group.rects, nestedArea);
    }

    // If the array of not added rects does not contain the id of the currently processed rect
    // it could be added to an existing area
    return !notAdded.map(r => r.id).includes(currentId);
  }

  /**
   * Get a flattened array of all nested areas.
   *
   * @param {SheetArea} area The parent area
   */
  _flatNestedAreaArrays = area => [
    area,
    ...(area.nestedAreas || []).flatMap(this._flatNestedAreaArrays),
  ];
}
