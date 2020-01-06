/* eslint-disable class-methods-use-this */
import _ from 'underscore';

import SheetArea from './SheetArea';

export default class Grouper {
  constructor(bladeWidth) {
    this._bladeWidth = bladeWidth;
  }

  group(rects, toAddTo, isNested, canRotate = true) {
    const { width: fullWidth, height: fullHeight } = toAddTo;
    // Group all rects by height
    const byHeight = _.groupBy(rects, 'height');

    const notAdded = [];

    // Add all full height rects to the result as long as they don't exceed the maximum width
    let hasFullHeightFullWidth = false;
    if (byHeight[fullHeight.toString()]) {
      const fullHeightRects = byHeight[fullHeight.toString()];
      const nonFullWidthRects = fullHeightRects.filter(r => r.width < fullWidth);
      hasFullHeightFullWidth = nonFullWidthRects.length !== fullHeightRects;
      const remaining = this._addFullHeightRects(toAddTo, nonFullWidthRects, fullWidth, fullHeight);
      notAdded.push(...remaining);
    }

    // Retrieve the remaining non full height heights
    const remainingHeights = Object.keys(byHeight)
      .map(h => parseInt(h, 10))
      .filter(h => h < fullHeight || (hasFullHeightFullWidth && h === fullHeight));

    if (!remainingHeights.length) {
      return toAddTo;
    }

    const nonFullHeightRectsByHeight = {};
    remainingHeights.forEach(h => {
      if (h === fullHeight) {
        nonFullHeightRectsByHeight[h] = byHeight[h].filter(r => r.width === fullWidth);
      } else {
        nonFullHeightRectsByHeight[h] = byHeight[h];
      }
    });

    const remainingRects = this._addMaxWidthGroups(toAddTo, nonFullHeightRectsByHeight);

    if (!remainingRects.length) {
      return toAddTo;
    }

    const remainingGroups = this._groupByHeight(
      _.groupBy(remainingRects, 'height'),
      fullWidth,
      fullHeight,
    );

    this._addNonFullSizeRects(toAddTo, remainingGroups);

    // Optimize the dimensions of each nested area
    if (!isNested) {
      this._optimizeNestedAreaDimensions(toAddTo);
    }

    return toAddTo;
  }

  _optimizeNestedAreaDimensions(parent) {
    const nestedByYPosition = _.groupBy(parent.nestedAreas, 'posY');
    const yPositions = Object.keys(nestedByYPosition)
      .map(k => parseInt(k, 10))
      .sort((l, r) => l - r);
    const maxYPosition = _.last(yPositions);

    yPositions.forEach(posY => {
      const nestedAreas = nestedByYPosition[posY.toString()];
      const maxPosX = Math.max(...nestedAreas.map(na => na.posX));

      const remainingWidth = parent.getRemainingWidth(posY);
      if (posY < maxYPosition) {
        const rightmostArea = nestedAreas.filter(na => na.posX === maxPosX).pop();
        if (remainingWidth > 0) {
          rightmostArea.extendWidth(remainingWidth + rightmostArea.cuttingWidth.right);
          rightmostArea.cuttingWidth = { right: 0 };
        }

        if (rightmostArea.nestedAreas && rightmostArea.nestedAreas.length) {
          this._optimizeNestedAreaDimensions(rightmostArea);
        }
      } else {
        nestedAreas.forEach(nestedArea => {
          const remainingHeight =
            parent.height - posY - nestedArea.height - nestedArea.cuttingWidth.bottom;
          if (
            nestedArea.posX === maxPosX &&
            remainingWidth > 0 &&
            remainingHeight >= 0 &&
            remainingWidth < remainingHeight
          ) {
            nestedArea.extendWidth(remainingWidth + nestedArea.cuttingWidth.right);
            nestedArea.cuttingWidth = { right: 0 };
          } else {
            const prevHeight = nestedArea.fullHeight;
            nestedArea.extendHeight(remainingHeight);
            nestedArea.cuttingWidth = { bottom: 0 };
            // parent.updateGrid(posY + prevHeight, nestedArea.fullWidth, remainingHeight);
          }

          if (nestedArea.nestedAreas && nestedArea.nestedAreas.length) {
            this._optimizeNestedAreaDimensions(nestedArea);
          }
        });
      }
    });
  }

  /**
   * Add all full height rects to the result as long as they don't exceed the maximum width.
   *
   * @param {object} toAddTo The object to add full height rects to
   * @param {Rect[]} rects The rects to be added
   */
  _addFullHeightRects(toAddTo, rects) {
    const notAdded = [];
    rects.forEach(rect => {
      // Add the rect if there is enough remaining width at the very first row
      if (toAddTo.getRemainingWidth(0) >= rect.width) {
        toAddTo.addRect(rect);
      } else {
        notAdded.push(rect);
      }
    });

    return notAdded;
  }

  _groupByMaxWidths(rects, width, bladeWidth) {
    const grouped = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const rect of rects) {
      let added = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const group of grouped) {
        if (group.width + bladeWidth + rect.width <= width) {
          group.rects.push(rect);
          group.width += bladeWidth + rect.width;
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
    // console.log(grouped);
    return grouped;
  }

  /**
   * Group all non full height rects by their height. Rects with the same height
   * are additionally grouped to at most fill the max sheet width.
   *
   * @param {object} rectsByHeight All available rects grouped by their height
   * @param {number} fullWidth The maximum available width
   * @param {number} fullHeight The maximum available height
   */
  _groupByHeight(rectsByHeight, fullWidth) {
    const groupedByHeight = {};

    Object.entries(rectsByHeight).forEach(([key, rects]) => {
      const groupedByWidth = this._groupByMaxWidths(rects, fullWidth, this._bladeWidth);
      groupedByHeight[parseInt(key, 10)] = groupedByWidth;
    });

    return groupedByHeight;
  }

  /**
   * Add all rects that fill the maximum remaining width.
   *
   * @param {object} toAddTo The object to add full width rects to
   * @param {object} groupedByHeight All available rects grouped by their height
   */
  _addMaxWidthGroups(toAddTo, rectsByHeight) {
    let notAdded = [];

    let remainingWidth = toAddTo.getRemainingWidth(0);
    if (remainingWidth === 0) {
      for (let i = 1; i < toAddTo.height; i += 1) {
        remainingWidth = toAddTo.getRemainingWidth(i);
        if (remainingWidth > 0) {
          break;
        }
      }
    }
    const groupedByHeight = this._groupByHeight(rectsByHeight, remainingWidth);

    const sortedHeights = Object.keys(groupedByHeight)
      .map(h => parseInt(h, 10))
      .sort((l, r) => r - l);

    sortedHeights.forEach(height => {
      const groupsOfHeight = groupedByHeight[height];
      groupsOfHeight.sort((l, r) => {
        let result = l.width - r.width;
        if (result === 0) {
          result = l.rects.length - r.rects.length;
        }

        return result;
      });

      groupsOfHeight.forEach(group => {
        const coords = toAddTo.canAdd(group.width, height, true);
        if (coords) {
          const [, posY] = coords;
          const localRemainingWidth = toAddTo.getRemainingWidth(posY);
          if (Number.isNaN(localRemainingWidth)) {
            toAddTo.extendHeight(height);
          }
          group.rects.sort((l, r) => l.width - r.width);
          group.rects.forEach(r => toAddTo.addRect(r));
        } else {
          notAdded = [...notAdded, ...group.rects];
        }
      });
    });

    return notAdded;
  }

  _addNonFullSizeRects(toAddTo, groupsByHeight) {
    const sortedHeights = Object.keys(groupsByHeight)
      .map(h => parseInt(h, 10))
      .sort((l, r) => r - l);

    sortedHeights.forEach(height => {
      const groupsOfHeight = groupsByHeight[height];

      groupsOfHeight.sort((l, r) => r.width - l.width);

      groupsOfHeight.forEach(group => {
        const { width, maxSingleWidth, rects } = group;

        const existingNestedArea = this._findNestedArea(
          width,
          maxSingleWidth,
          height,
          toAddTo.nestedAreas,
        );

        if (
          existingNestedArea &&
          (existingNestedArea.width >= width || existingNestedArea.width >= maxSingleWidth)
        ) {
          const prevFullHeight = existingNestedArea.fullHeight;
          if (existingNestedArea.extendHeight(height)) {
            this.group(rects, existingNestedArea, true);
            // toAddTo.updateGrid(
            //   existingNestedArea.posY + prevFullHeight,
            //   existingNestedArea.fullWidth,
            //   existingNestedArea.fullHeight - prevFullHeight,
            // );
          }
        } else {
          let maxHeight = toAddTo.getMaximumHeight(width, height);
          let useSingleWidth = false;
          if (maxHeight < height) {
            maxHeight = toAddTo.getMaximumHeight(maxSingleWidth, height);
            useSingleWidth = true;
          }

          if (maxHeight >= height) {
            const newNestedArea = new SheetArea(
              useSingleWidth ? maxSingleWidth : width,
              height,
              maxHeight,
              this._bladeWidth,
              toAddTo,
            );
            this.group(rects, newNestedArea, true);
            const [, posY] = toAddTo.canAdd(newNestedArea.fullWidth, newNestedArea.fullHeight);
            if (posY === false) {
              throw new Error('Something went wrong');
            }

            if (toAddTo.height < posY) {
              toAddTo.extendHeight(newNestedArea.fullHeight);
            }
            toAddTo.addNestedArea(newNestedArea);
          }
        }
      });
    });
  }

  _findNestedArea(width, maxSingleWidth, height, availableNestedAreas, sameWidthOnly) {
    if (!availableNestedAreas || !availableNestedAreas.length) {
      return undefined;
    }

    // Find first level nested areas with the same width and enough remaining height
    let matchingNestedArea = availableNestedAreas
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

    // Find deeper level nested areas with the same width and enough remaining height
    const hasNestedAreas = availableNestedAreas.filter(
      na => na.nestedAreas && na.nestedAreas.length,
    );

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
