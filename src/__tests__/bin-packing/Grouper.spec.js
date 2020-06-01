import { Grouper, Rect, SheetArea } from '../../bin-packing';
import { safeStringify } from '../helper';
import { bladeWidth, testItems, getRects, getSheetArea } from '../../data/testitemdata';
import osbItems from '../../data/osbitemdata';

const checkArea = (
  actual,
  width,
  height,
  posX,
  posY,
  cuttingTop,
  cuttingRight,
  cuttingBottom,
  cuttingLeft,
  rectsLength,
  nestedAreasLength,
) => {
  expect(actual).toBeDefined();
  expect(actual.fullWidth).toBe(width);
  expect(actual.fullHeight).toBe(height);
  expect(actual.posX).toBe(posX);
  expect(actual.posY).toBe(posY);
  expect(actual.cuttingWidth.top).toBe(cuttingTop);
  expect(actual.cuttingWidth.right).toBe(cuttingRight);
  expect(actual.cuttingWidth.bottom).toBe(cuttingBottom);
  expect(actual.cuttingWidth.left).toBe(cuttingLeft);
  expect(actual.rects).toHaveLength(rectsLength);
  expect(actual.nestedAreas).toHaveLength(nestedAreasLength);
};

const checkRemainingWidth = (actual, expected) => {
  expected.forEach(([atHeight, expectedRemainingWidth]) => {
    try {
      expect(actual.getRemainingWidth(atHeight)).toBe(expectedRemainingWidth);
    } catch (e) {
      throw new Error(
        `Expected remaining width at ${atHeight} to be ${expectedRemainingWidth} but was ${actual.getRemainingWidth(
          atHeight,
        )}`,
      );
    }
  });
};

const checkRect = (
  actual,
  name,
  posX,
  posY,
  cuttingTop,
  cuttingRight,
  cuttingBottom,
  cuttingLeft,
) => {
  expect(actual.name).toBe(name);
  expect(actual.posX).toBe(posX);
  expect(actual.posY).toBe(posY);
  expect(actual.cuttingWidth.top).toBe(cuttingTop);
  expect(actual.cuttingWidth.right).toBe(cuttingRight);
  expect(actual.cuttingWidth.bottom).toBe(cuttingBottom);
  expect(actual.cuttingWidth.left).toBe(cuttingLeft);
};

describe('Grouper', () => {
  it('should pack three items into a matching sheet', () => {
    const rects = getRects(testItems.gt1);
    const grouped = getSheetArea(testItems.gt1);

    new Grouper(bladeWidth).group(rects, grouped);
    checkArea(grouped, 610, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);
    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 0, 0, 0);
  });

  it('should pack three items into a wider sheet', () => {
    const rects = getRects(testItems.gt2);
    const grouped = getSheetArea(testItems.gt2);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 85]]);

    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, bladeWidth, 0, 0);
  });

  it('should pack three items into a little bit wider sheet', () => {
    const rects = getRects(testItems.gt3);
    const grouped = getSheetArea(testItems.gt3);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 613, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 3, 0, 0);
  });

  it('should pack three items into a higher sheet', () => {
    const rects = getRects(testItems.gt4);
    const grouped = getSheetArea(testItems.gt4);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack six items into two rows', () => {
    const rects = getRects(testItems.gt5);
    const grouped = getSheetArea(testItems.gt5);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 0, 0, 4, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [105, 0],
    ]);

    checkRect(grouped.rects[0], 'B', 305, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[1], 'A', 510, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'E', 305, 105, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[3], 'F', 510, 105, 0, 0, 0, 0);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 305, 200, 0, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(area1.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'D', 0, 105, 0, 0, 0, 0);
  });

  it('should pack six items into two rows in a bigger sheet', () => {
    const rects = getRects(testItems.gt6);
    const grouped = getSheetArea(testItems.gt6);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [[0, 1690]]);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 310, 600, 0, 0, 0, bladeWidth, 0, 0, 6, 0);

    checkRect(area1.rects[0], 'B', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 205, 0, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'E', 0, 105, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[3], 'F', 205, 105, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[4], 'C', 0, 205, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[5], 'D', 0, 310, 0, bladeWidth, bladeWidth, 0);
  });

  it('should pack three items into a wider and higher sheet', () => {
    const rects = getRects(testItems.gt7);
    const grouped = getSheetArea(testItems.gt7);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 200, 0, 0, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [[0, 0]]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 700, 105, 0, 0, 0, 0, bladeWidth, 0, 3, 0);
    checkRemainingWidth(nestedArea, [[0, 85]]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(nestedArea.rects[1], 'B', 305, 0, 0, bladeWidth, 0, 0);
    checkRect(nestedArea.rects[2], 'A', 510, 0, 0, bladeWidth, 0, 0);
  });

  it('should pack two items, one smaller than the other', () => {
    const rects = getRects(testItems.gt8);
    const grouped = getSheetArea(testItems.gt8);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 400, 0, 0, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 440],
      [199, 440],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 400, 205, 0, 0, bladeWidth, 0, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [355, 50],
    ]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack three items, two smaller than the first', () => {
    const rects = getRects(testItems.gt9);
    const grouped = getSheetArea(testItems.gt9);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 400, 0, 0, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 355],
      [199, 355],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 140, 400, 205, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'B', 85, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack 5 of 6 items', () => {
    const rects = getRects(testItems.gt10);
    const grouped = getSheetArea(testItems.gt10);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 205],
      [558, 205],
      [559, 205],
      [560, 205],
      [561, 205],
      [562, 205],
      [563, 205],
      [564, 205],
      [565, 205],
      [566, 205],
      [599, 205],
      [600, NaN],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, 0, bladeWidth, 0, 0, 2, 1);
    checkRemainingWidth(nestedArea, [[0, 0]]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, 0, bladeWidth, 0);

    const nestedNestedArea = nestedArea.nestedAreas[0];
    checkArea(nestedNestedArea, 745, 205, 0, 395, 0, bladeWidth, 0, 0, 1, 1);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [106, 35],
    ]);
    checkRect(nestedNestedArea.rects[0], 'D', 0, 0, 0, 0, bladeWidth, 0);

    checkArea(nestedNestedArea.nestedAreas[0], 705, 100, 0, 105, 0, bladeWidth, 0, 0, 1, 0);
    checkRemainingWidth(nestedNestedArea.nestedAreas[0], [[0, 0]]);
    checkRect(nestedNestedArea.nestedAreas[0].rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack two items', () => {
    const rects = getRects(testItems.gt11);
    const grouped = getSheetArea(testItems.gt11);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 1000, 600, 0, 0, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 945],
      [599, 945],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 545, 0, 55, 0, bladeWidth, 0, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [544, 50],
    ]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack three items', () => {
    const rects = getRects(testItems.gt12);
    const grouped = getSheetArea(testItems.gt12);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 2, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 1040],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 545, 905, 55, 0, bladeWidth, 0, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [544, 50],
    ]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack four items in three rows', () => {
    const rects = getRects(testItems.gt13);
    const grouped = getSheetArea(testItems.gt13);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 3, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 0],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'B', 905, 55, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 490, 905, 110, 0, bladeWidth, 0, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [489, 50],
    ]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack six items in three rows', () => {
    const rects = getRects(testItems.gt14);
    const grouped = getSheetArea(testItems.gt14);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 5, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 0],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'E', 905, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'B', 905, 55, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[3], 'C', 1505, 55, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[4], 'D', 1905, 55, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 490, 905, 110, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(nestedArea.rects[0], 'F', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack three + one items', () => {
    const rects = getRects(testItems.gt15);
    const grouped = getSheetArea(testItems.gt15);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 2, 2);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 935],
      [599, 935],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, 0, bladeWidth, 0);

    checkArea(grouped.nestedAreas[0], 55, 545, 905, 55, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(grouped.nestedAreas[0].rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkArea(grouped.nestedAreas[1], 105, 545, 960, 55, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(grouped.nestedAreas[1].rects[0], 'D', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack four rects in two rows', () => {
    const rects = getRects(testItems.gt16);
    const grouped = getSheetArea(testItems.gt16);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2500, 1250, 0, 0, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [
      [0, 800],
      [1000, 800],
      [1244, 800],
      [1245, 800],
      [1246, 800],
      [1247, 800],
      [1248, 800],
      [1249, 800],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 1700, 1250, 0, 0, 0, bladeWidth, bladeWidth, 0, 4, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea.rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'A', 850, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea.rects[2], 'A', 0, 625, 0, bladeWidth, 0, 0);
    checkRect(nestedArea.rects[3], 'A', 850, 625, 0, 0, 0, 0);
  });

  it('should pack four rects in two rows with eight rects beside them', () => {
    const rects = getRects(testItems.gt17);
    const grouped = getSheetArea(testItems.gt17);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2500, 1250, 0, 0, 0, 0, 0, 0, 0, 3);
    checkRemainingWidth(grouped, [
      [0, 175],
      [1000, 175],
      [1249, 175],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 850, 1250, 0, 0, 0, bladeWidth, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'C', 0, 625, 0, 0, 0, 0);

    const nestedArea2 = grouped.nestedAreas[1];
    checkArea(nestedArea2, 850, 1250, 850, 0, 0, bladeWidth, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedArea2, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea2.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[1], 'C', 0, 625, 0, 0, 0, 0);

    const nestedArea3 = grouped.nestedAreas[2];
    checkArea(nestedArea3, 625, 1250, 1700, 0, 0, bladeWidth, 0, 0, 8, 0);
    checkRemainingWidth(nestedArea3, [
      [0, 0],
      [1000, 0],
      [1249, 620],
    ]);

    checkRect(nestedArea3.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[1], 'A', 0, 205, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[2], 'A', 0, 410, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[3], 'A', 0, 615, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[4], 'B', 0, 820, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[5], 'B', 0, 925, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[6], 'B', 0, 1030, 0, 0, bladeWidth, 0);
    checkRect(nestedArea3.rects[7], 'B', 0, 1135, 0, 0, bladeWidth, 0);
  });

  it('should pack 7 of 7 items', () => {
    const rects = getRects(testItems.gt18);
    const grouped = getSheetArea(testItems.gt18);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 205],
      [558, 205],
      [559, 205],
      [560, 205],
      [561, 205],
      [562, 205],
      [563, 205],
      [564, 205],
      [565, 205],
      [566, 205],
      [599, 205],
      [600, NaN],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, 0, bladeWidth, 0, 0, 2, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [395, 140],
    ]);

    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, 0, bladeWidth, 0);

    checkArea(nestedArea.nestedAreas[0], 745, 205, 0, 395, 0, bladeWidth, 0, 0, 2, 1);
    checkRemainingWidth(nestedArea.nestedAreas[0], [
      [0, 0],
      [70, 35],
    ]);

    checkRect(nestedArea.nestedAreas[0].rects[0], 'D', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea.nestedAreas[0].rects[1], 'D', 0, 35, 0, 0, bladeWidth, 0);

    const nestedNestedArea = nestedArea.nestedAreas[0].nestedAreas[0];
    checkArea(nestedNestedArea, 705, 135, 0, 70, 0, bladeWidth, 0, 0, 2, 0);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [74, 0],
    ]);

    checkRect(nestedNestedArea.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedNestedArea.rects[1], 'C', 0, 65, 0, 0, bladeWidth, 0);
  });

  it('should not use the deepest sheet area', () => {
    const rects = getRects(testItems.gt19);
    const grouped = getSheetArea(testItems.gt19);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'C', 0, 35, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'D', 373, 35, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 705, 135, 0, 70, 0, bladeWidth, 0, 0, 2, 0);
  });

  it('should use full width if rects plus cutting width are >= full width', () => {
    const rects = getRects(testItems.gt20);
    const grouped = getSheetArea(testItems.gt20);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'C', 0, 35, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'C', 372, 35, 0, 1, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 705, 135, 0, 70, 0, bladeWidth, 0, 0, 2, 0);
  });
});

describe('Grouper for OSB sheets', () => {
  it('should group sheet 1 correct', () => {
    const rects = getRects(osbItems.s1);
    const grouped = getSheetArea(osbItems.s1);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 3);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 875, 665, 0, 0, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 875, 665, 875, 0, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(area2.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);

    const area3 = grouped.nestedAreas[2];
    checkArea(area3, 290, 625, 1750, 0, 0, 0, bladeWidth, 0, 2, 0);
    checkRect(area3.rects[0], 'B', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(area3.rects[1], 'A', 205, 0, 0, bladeWidth, 0, 0);
  });

  it('should group sheet 2 correct', () => {
    const rects = getRects(osbItems.s2);
    const grouped = getSheetArea(osbItems.s2);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, 0, bladeWidth, 0, 5, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[1], 'A', 850, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[3], 'C', 1905, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[4], 'C', 1970, 0, 0, bladeWidth, 0, 0);
  });

  it('should group sheet 3 correct', () => {
    const rects = getRects(osbItems.s3);
    const grouped = getSheetArea(osbItems.s3);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 2);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 955, 665, 0, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'E', 850, 0, 0, 0, bladeWidth, 0);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 871, 665, 955, 0, 0, bladeWidth, 0, 0, 3, 0);
    checkRect(area2.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[1], 'C', 0, 263, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[2], 'B', 0, 526, 0, 0, bladeWidth, 0);
  });

  it('should group sheet 4 correct', () => {
    const rects = getRects(osbItems.s4);
    const grouped = getSheetArea(osbItems.s4);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, 0, bladeWidth, 0, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[1], 'A', 850, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[3], 'C', 1905, 0, 0, bladeWidth, 0, 0);
  });

  it('should group sheet 5 correct', () => {
    const rects = getRects(osbItems.s5);
    const grouped = getSheetArea(osbItems.s5);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, 0, bladeWidth, 0, 5, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[1], 'A', 850, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[3], 'B', 1805, 0, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[4], 'B', 1910, 0, 0, bladeWidth, 0, 0);
  });

  it('should group sheet 6 correct', () => {
    const rects = getRects(osbItems.s6);
    const grouped = getSheetArea(osbItems.s6);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 2, 2);
    checkRect(grouped.rects[0], 'D', 1830, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[1], 'D', 1935, 0, 0, bladeWidth, bladeWidth, 0);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 955, 665, 0, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'D', 850, 0, 0, 0, bladeWidth, 0);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 875, 665, 955, 0, 0, bladeWidth, 0, 0, 5, 1);
    checkRect(area2.rects[0], 'B', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[1], 'B', 0, 55, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[2], 'C', 0, 110, 0, 4, bladeWidth, 0);
    checkRect(area2.rects[3], 'C', 0, 259, 0, 4, bladeWidth, 0);
    checkRect(area2.rects[4], 'C', 0, 408, 0, 4, bladeWidth, 0);

    checkArea(area2.nestedAreas[0], 826, 108, 0, 557, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(area2.nestedAreas[0].rects[0], 'E', 0, 0, 0, 0, bladeWidth, 0);
  });

  it('should group sheet 7 correct', () => {
    const rects = getRects(osbItems.s7);
    const grouped = getSheetArea(osbItems.s7);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 3);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 871, 665, 0, 0, 0, bladeWidth, 0, 0, 3, 1);
    checkRect(area1.rects[0], 'F', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'F', 0, 149, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'F', 0, 298, 0, 0, bladeWidth, 0);

    checkArea(area1.nestedAreas[0], 826, 218, 0, 447, 0, bladeWidth, 0, 0, 1, 0);
    checkRect(area1.nestedAreas[0].rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 875, 665, 871, 0, 0, bladeWidth, 0, 0, 2, 1);
    checkRect(area2.rects[0], 'D', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[1], 'D', 0, 55, 0, 0, bladeWidth, 0);

    checkArea(area2.nestedAreas[0], 870, 480, 0, 110, 0, 0, bladeWidth, 0, 4, 0);
    checkRect(area2.nestedAreas[0].rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area2.nestedAreas[0].rects[1], 'B', 0, 205, 0, bladeWidth, bladeWidth, 0);
    checkRect(area2.nestedAreas[0].rects[2], 'B', 0, 310, 0, bladeWidth, bladeWidth, 0);
    checkRect(area2.nestedAreas[0].rects[3], 'E', 0, 415, 0, bladeWidth, 0, 0);

    const area3 = grouped.nestedAreas[2];
    checkArea(area3, 170, 665, 1746, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(area3.rects[0], 'G', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area3.rects[1], 'A', 105, 0, 0, 0, bladeWidth, 0);
  });

  it('should group sheet 8 correct', () => {
    const rects = getRects(osbItems.s8);
    const grouped = getSheetArea(osbItems.s8);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 2);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 826, 665, 0, 0, 0, bladeWidth, 0, 0, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 0, 205, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'C', 0, 410, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'C', 0, 515, 0, 0, bladeWidth, 0);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 826, 665, 826, 0, 0, bladeWidth, 0, 0, 7, 0);
    checkRect(area2.rects[0], 'C', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[1], 'C', 0, 105, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[2], 'C', 0, 210, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[3], 'C', 0, 315, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[4], 'C', 0, 420, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[5], 'B', 0, 525, 0, 0, bladeWidth, 0);
    checkRect(area2.rects[6], 'B', 0, 590, 0, 0, bladeWidth, 0);
  });

  it('should group sheet 9 correct', () => {
    const rects = getRects(osbItems.s9);
    const grouped = getSheetArea(osbItems.s9);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 871, 665, 0, 0, 0, bladeWidth, 0, 0, 1, 1);
    checkRect(area1.rects[0], 'B', 0, 0, 0, 0, bladeWidth, 0);

    checkArea(area1.nestedAreas[0], 866, 315, 0, 97, 0, 0, bladeWidth, 0, 3, 0);
    checkRect(area1.nestedAreas[0].rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.nestedAreas[0].rects[1], 'A', 0, 105, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.nestedAreas[0].rects[2], 'A', 0, 210, 0, bladeWidth, 0, 0);
  });

  it('should group sheet 10 correct', () => {
    const rects = getRects(osbItems.s10);
    const grouped = getSheetArea(osbItems.s10);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 1810, 665, 0, 0, 0, bladeWidth, 0, 0, 2, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 905, 0, 0, 0, bladeWidth, 0);
  });

  it('should group sheet 11 correct', () => {
    const rects = getRects(osbItems.s11);
    const grouped = getSheetArea(osbItems.s11);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 210, 0, 0, 0, 0, bladeWidth, 0, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 875, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[2], 'A', 0, 105, 0, bladeWidth, 0, 0);
    checkRect(area1.rects[3], 'A', 875, 105, 0, bladeWidth, 0, 0);
  });
});
