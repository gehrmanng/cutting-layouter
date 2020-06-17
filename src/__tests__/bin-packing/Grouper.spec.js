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
  cuttingRight,
  cuttingBottom,
  rectsLength,
  nestedAreasLength,
) => {
  expect(actual).toBeDefined();
  expect(actual.fullWidth).toBe(width);
  expect(actual.fullHeight).toBe(height);
  expect(actual.posX).toBe(posX);
  expect(actual.posY).toBe(posY);
  expect(actual.cuttingWidth.right).toBe(cuttingRight);
  expect(actual.cuttingWidth.bottom).toBe(cuttingBottom);
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

const checkRect = (actual, name, posX, posY, cuttingRight, cuttingBottom) => {
  expect(actual.name).toBe(name);
  expect(actual.posX).toBe(posX);
  expect(actual.posY).toBe(posY);
  expect(actual.cuttingWidth.right).toBe(cuttingRight);
  expect(actual.cuttingWidth.bottom).toBe(cuttingBottom);
};

describe('Grouper', () => {
  it('should pack three items into a matching sheet (GT1)', () => {
    const rects = getRects(testItems.gt1);
    const grouped = getSheetArea(testItems.gt1);

    new Grouper(bladeWidth).group(rects, grouped);
    checkArea(grouped, 610, 100, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);
    checkRect(grouped.rects[0], 'C', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 0);
  });

  it('should pack three items into a wider sheet (GT2)', () => {
    const rects = getRects(testItems.gt2);
    const grouped = getSheetArea(testItems.gt2);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 100, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 85]]);

    checkRect(grouped.rects[0], 'C', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, bladeWidth, 0);
  });

  it('should pack three items into a little bit wider sheet (GT3)', () => {
    const rects = getRects(testItems.gt3);
    const grouped = getSheetArea(testItems.gt3);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 613, 100, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'C', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 3, 0);
  });

  it('should pack three items into a higher sheet (GT4)', () => {
    const rects = getRects(testItems.gt4);
    const grouped = getSheetArea(testItems.gt4);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(grouped.rects[1], 'B', 305, 0, bladeWidth, bladeWidth);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, bladeWidth);
  });

  it('should pack six items into two rows (GT5)', () => {
    const rects = getRects(testItems.gt5);
    const grouped = getSheetArea(testItems.gt5);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 4, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [105, 0],
    ]);

    checkRect(grouped.rects[0], 'B', 305, 0, bladeWidth, bladeWidth);
    checkRect(grouped.rects[1], 'A', 510, 0, 0, bladeWidth);
    checkRect(grouped.rects[2], 'E', 305, 105, bladeWidth, 0);
    checkRect(grouped.rects[3], 'F', 510, 105, 0, 0);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 305, 200, 0, 0, bladeWidth, 0, 2, 0);
    checkRect(area1.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(area1.rects[1], 'D', 0, 105, 0, 0);
  });

  it('should pack six items into two rows in a bigger sheet (GT6)', () => {
    const rects = getRects(testItems.gt6);
    const grouped = getSheetArea(testItems.gt6);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [[0, 1690]]);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 310, 600, 0, 0, bladeWidth, 0, 6, 0);

    checkRect(area1.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[1], 'A', 205, 0, 0, bladeWidth);
    checkRect(area1.rects[2], 'E', 0, 105, bladeWidth, bladeWidth);
    checkRect(area1.rects[3], 'F', 205, 105, 0, bladeWidth);
    checkRect(area1.rects[4], 'C', 0, 205, bladeWidth, bladeWidth);
    checkRect(area1.rects[5], 'D', 0, 310, bladeWidth, bladeWidth);
  });

  it('should pack three items into a wider and higher sheet (GT7)', () => {
    const rects = getRects(testItems.gt7);
    const grouped = getSheetArea(testItems.gt7);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 200, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [[0, 0]]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 700, 105, 0, 0, 0, bladeWidth, 3, 0);
    checkRemainingWidth(nestedArea, [[0, 85]]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'B', 305, 0, bladeWidth, 0);
    checkRect(nestedArea.rects[2], 'A', 510, 0, bladeWidth, 0);
  });

  it('should pack two items, one smaller than the other (GT8)', () => {
    const rects = getRects(testItems.gt8);
    const grouped = getSheetArea(testItems.gt8);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 400, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 440],
      [199, 440],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 400, 205, 0, bladeWidth, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [355, 50],
    ]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, bladeWidth);
  });

  it('should pack three items, two smaller than the first (GT9)', () => {
    const rects = getRects(testItems.gt9);
    const grouped = getSheetArea(testItems.gt9);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 700, 400, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 355],
      [199, 355],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 140, 400, 205, 0, bladeWidth, 0, 2, 0);
    checkRect(nestedArea.rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 85, 0, 0, bladeWidth);
  });

  it('should pack 5 of 6 items (GT10)', () => {
    const rects = getRects(testItems.gt10);
    const grouped = getSheetArea(testItems.gt10);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 1, 1);
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

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea, [[0, 0]]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, bladeWidth);

    const nestedNestedArea = nestedArea.nestedAreas[0];
    checkArea(nestedNestedArea, 745, 205, 0, 395, bladeWidth, 0, 1, 1);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [106, 35],
    ]);
    checkRect(nestedNestedArea.rects[0], 'D', 0, 0, 0, bladeWidth);

    checkArea(nestedNestedArea.nestedAreas[0], 705, 100, 0, 105, bladeWidth, 0, 1, 0);
    checkRemainingWidth(nestedNestedArea.nestedAreas[0], [[0, 0]]);
    checkRect(nestedNestedArea.nestedAreas[0].rects[0], 'C', 0, 0, 0, bladeWidth);
  });

  it('should pack two items (GT11)', () => {
    const rects = getRects(testItems.gt11);
    const grouped = getSheetArea(testItems.gt11);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 1000, 600, 0, 0, 0, 0, 1, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 945],
      [599, 945],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 545, 0, 55, bladeWidth, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [544, 50],
    ]);
    checkRect(nestedArea.rects[0], 'B', 0, 0, 0, bladeWidth);
  });

  it('should pack three items (GT12)', () => {
    const rects = getRects(testItems.gt12);
    const grouped = getSheetArea(testItems.gt12);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 2, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 1040],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 545, 905, 55, bladeWidth, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [544, 50],
    ]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
  });

  it('should pack four items in three rows (GT13)', () => {
    const rects = getRects(testItems.gt13);
    const grouped = getSheetArea(testItems.gt13);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 3, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 0],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, bladeWidth);
    checkRect(grouped.rects[2], 'B', 905, 55, 0, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 490, 905, 110, bladeWidth, 0, 1, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [55, 0],
      [489, 50],
    ]);
    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
  });

  it('should pack six items in three rows (GT14)', () => {
    const rects = getRects(testItems.gt14);
    const grouped = getSheetArea(testItems.gt14);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 5, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 0],
      [599, 1040],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'E', 905, 0, 0, bladeWidth);
    checkRect(grouped.rects[2], 'B', 905, 55, bladeWidth, bladeWidth);
    checkRect(grouped.rects[3], 'C', 1505, 55, bladeWidth, bladeWidth);
    checkRect(grouped.rects[4], 'D', 1905, 55, 0, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 55, 490, 905, 110, bladeWidth, 0, 1, 0);
    checkRect(nestedArea.rects[0], 'F', 0, 0, 0, bladeWidth);
  });

  it('should pack three + one items (GT15)', () => {
    const rects = getRects(testItems.gt15);
    const grouped = getSheetArea(testItems.gt15);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 2, 2);
    checkRemainingWidth(grouped, [
      [0, 0],
      [55, 935],
      [599, 935],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 905, 0, 0, bladeWidth);

    checkArea(grouped.nestedAreas[0], 55, 545, 905, 55, bladeWidth, 0, 1, 0);
    checkRect(grouped.nestedAreas[0].rects[0], 'C', 0, 0, 0, bladeWidth);
    checkArea(grouped.nestedAreas[1], 105, 545, 960, 55, bladeWidth, 0, 1, 0);
    checkRect(grouped.nestedAreas[1].rects[0], 'D', 0, 0, 0, bladeWidth);
  });

  it('should pack four rects in two rows (GT16)', () => {
    const rects = getRects(testItems.gt16);
    const grouped = getSheetArea(testItems.gt16);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2500, 1250, 0, 0, 0, 0, 0, 1);
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
    checkArea(nestedArea, 1700, 1250, 0, 0, bladeWidth, bladeWidth, 4, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea.rects[0], 'A', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'A', 850, 0, 0, bladeWidth);
    checkRect(nestedArea.rects[2], 'A', 0, 625, bladeWidth, 0);
    checkRect(nestedArea.rects[3], 'A', 850, 625, 0, 0);
  });

  it('should pack four rects in two rows with eight rects beside them (GT17)', () => {
    const rects = getRects(testItems.gt17);
    const grouped = getSheetArea(testItems.gt17);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2500, 1250, 0, 0, 0, 0, 0, 2);
    checkRemainingWidth(grouped, [
      [0, 175],
      [1000, 175],
      [1249, 175],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 1700, 1250, 0, 0, bladeWidth, bladeWidth, 4, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea.rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'C', 850, 0, 0, bladeWidth);
    checkRect(nestedArea.rects[2], 'C', 0, 625, bladeWidth, 0);
    checkRect(nestedArea.rects[3], 'C', 850, 625, 0, 0);

    const nestedArea2 = grouped.nestedAreas[1];
    checkArea(nestedArea2, 625, 1250, 1700, 0, bladeWidth, 0, 8, 0);
    checkRemainingWidth(nestedArea2, [
      [0, 0],
      [1000, 0],
      [1249, 620],
    ]);

    checkRect(nestedArea2.rects[0], 'A', 0, 0, 0, bladeWidth);
    checkRect(nestedArea2.rects[1], 'A', 0, 205, 0, bladeWidth);
    checkRect(nestedArea2.rects[2], 'A', 0, 410, 0, bladeWidth);
    checkRect(nestedArea2.rects[3], 'A', 0, 615, 0, bladeWidth);
    checkRect(nestedArea2.rects[4], 'B', 0, 820, 0, bladeWidth);
    checkRect(nestedArea2.rects[5], 'B', 0, 925, 0, bladeWidth);
    checkRect(nestedArea2.rects[6], 'B', 0, 1030, 0, bladeWidth);
    checkRect(nestedArea2.rects[7], 'B', 0, 1135, 0, bladeWidth);
  });

  it('should pack 7 of 7 items (GT18)', () => {
    const rects = getRects(testItems.gt18);
    const grouped = getSheetArea(testItems.gt18);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 1, 1);
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

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [395, 140],
    ]);

    checkRect(nestedArea.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, bladeWidth);

    checkArea(nestedArea.nestedAreas[0], 745, 205, 0, 395, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea.nestedAreas[0], [
      [0, 0],
      [70, 35],
    ]);

    checkRect(nestedArea.nestedAreas[0].rects[0], 'D', 0, 0, 0, bladeWidth);
    checkRect(nestedArea.nestedAreas[0].rects[1], 'D', 0, 35, 0, bladeWidth);

    const nestedNestedArea = nestedArea.nestedAreas[0].nestedAreas[0];
    checkArea(nestedNestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [74, 0],
    ]);

    checkRect(nestedNestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(nestedNestedArea.rects[1], 'C', 0, 65, 0, bladeWidth);
  });

  it('should not use the deepest sheet area (GT19)', () => {
    const rects = getRects(testItems.gt19);
    const grouped = getSheetArea(testItems.gt19);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth);
    checkRect(grouped.rects[1], 'C', 0, 35, bladeWidth, bladeWidth);
    checkRect(grouped.rects[2], 'D', 373, 35, 0, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
  });

  it('should use full width if rects plus cutting width are >= full width (GT20)', () => {
    const rects = getRects(testItems.gt20);
    const grouped = getSheetArea(testItems.gt20);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth);
    checkRect(grouped.rects[1], 'C', 0, 35, bladeWidth, bladeWidth);
    checkRect(grouped.rects[2], 'C', 372, 35, 1, bladeWidth);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
  });

  it('should group same height rects in one row of same width as a single rect (GT21)', () => {
    const rects = getRects(testItems.gt21);
    const grouped = getSheetArea(testItems.gt21);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 1, 1);
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

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [395, 140],
    ]);

    checkRect(nestedArea.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, bladeWidth);

    checkArea(nestedArea.nestedAreas[0], 745, 205, 0, 395, bladeWidth, 0, 3, 1);
    checkRemainingWidth(nestedArea.nestedAreas[0], [
      [0, 0],
      [70, 35],
    ]);

    checkRect(nestedArea.nestedAreas[0].rects[0], 'D', 0, 0, 0, bladeWidth);
    checkRect(nestedArea.nestedAreas[0].rects[1], 'E', 0, 35, bladeWidth, bladeWidth);
    checkRect(nestedArea.nestedAreas[0].rects[2], 'E', 372, 35, 1, bladeWidth);

    const nestedNestedArea = nestedArea.nestedAreas[0].nestedAreas[0];
    checkArea(nestedNestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [74, 0],
    ]);

    checkRect(nestedNestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(nestedNestedArea.rects[1], 'C', 0, 65, 0, bladeWidth);
  });

  it('should add 20 tiny rects in one block (GT22)', () => {
    const rects = getRects(testItems.gt22);
    const grouped = getSheetArea(testItems.gt22);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 21, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [549, 0],
      [550, 205],
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

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    let posY = 0;
    for (let r = 1; r < 21; r += 2) {
      checkRect(grouped.rects[r], 'E', 1795, posY, bladeWidth, bladeWidth);
      checkRect(grouped.rects[r + 1], 'E', 1900, posY, 0, bladeWidth);
      posY += 55;
    }

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [395, 140],
    ]);

    checkRect(nestedArea.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, bladeWidth);

    checkArea(nestedArea.nestedAreas[0], 745, 205, 0, 395, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea.nestedAreas[0], [
      [0, 0],
      [70, 35],
    ]);

    checkRect(nestedArea.nestedAreas[0].rects[0], 'D', 0, 0, 0, bladeWidth);
    checkRect(nestedArea.nestedAreas[0].rects[1], 'D', 0, 35, 0, bladeWidth);

    const nestedNestedArea = nestedArea.nestedAreas[0].nestedAreas[0];
    checkArea(nestedNestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [74, 0],
    ]);

    checkRect(nestedNestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(nestedNestedArea.rects[1], 'C', 0, 65, 0, bladeWidth);
  });

  it('should add 25 tiny rects in one block (GT23)', () => {
    const rects = getRects(testItems.gt23);
    const grouped = getSheetArea(testItems.gt23);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 23, 1);
    checkRemainingWidth(grouped, [
      [0, 0],
      [549, 0],
      [550, 0],
      [558, 0],
      [559, 0],
      [560, 0],
      [561, 0],
      [562, 0],
      [563, 0],
      [564, 0],
      [565, 0],
      [566, 0],
      [599, 0],
      [600, NaN],
    ]);

    checkRect(grouped.rects[0], 'A', 0, 0, bladeWidth, 0);
    let posY = 0;
    for (let r = 1; r < 21; r += 2) {
      checkRect(grouped.rects[r], 'E', 1795, posY, bladeWidth, bladeWidth);
      checkRect(grouped.rects[r + 1], 'E', 1900, posY, 0, bladeWidth);
      posY += 55;
    }
    checkRect(grouped.rects[21], 'E', 1795, 550, bladeWidth, 0);
    checkRect(grouped.rects[22], 'E', 1900, 550, 0, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 890, 600, 905, 0, bladeWidth, 0, 2, 2);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [395, 0],
      [559, 0],
      [560, 140],
    ]);

    checkRect(nestedArea.rects[0], 'B', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.rects[1], 'B', 445, 0, 0, bladeWidth);

    checkArea(nestedArea.nestedAreas[0], 745, 205, 0, 395, bladeWidth, 0, 2, 1);
    checkRemainingWidth(nestedArea.nestedAreas[0], [
      [0, 0],
      [70, 35],
    ]);

    checkRect(nestedArea.nestedAreas[0].rects[0], 'D', 0, 0, 0, bladeWidth);
    checkRect(nestedArea.nestedAreas[0].rects[1], 'D', 0, 35, 0, bladeWidth);

    checkArea(nestedArea.nestedAreas[1], 140, 165, 745, 395, 0, bladeWidth, 3, 0);
    checkRemainingWidth(nestedArea.nestedAreas[1], [
      [0, 35],
      [70, 35],
      [139, 35],
    ]);

    checkRect(nestedArea.nestedAreas[1].rects[0], 'E', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea.nestedAreas[1].rects[1], 'E', 0, 55, bladeWidth, bladeWidth);
    checkRect(nestedArea.nestedAreas[1].rects[2], 'E', 0, 110, bladeWidth, 0);

    const nestedNestedArea = nestedArea.nestedAreas[0].nestedAreas[0];
    checkArea(nestedNestedArea, 705, 135, 0, 70, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedNestedArea, [
      [0, 0],
      [74, 0],
    ]);

    checkRect(nestedNestedArea.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(nestedNestedArea.rects[1], 'C', 0, 65, 0, bladeWidth);
  });

  it('should pack all items in the most compact way (GT24)', () => {
    const rects = getRects(testItems.gt24);
    const grouped = getSheetArea(testItems.gt24);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [
      [0, 950],
      [566, 950],
      [599, 950],
      [600, NaN],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 1050, 600, 0, 0, bladeWidth, 0, 20, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [110, 35],
      [395, 35],
      [489, 35],
      [599, 35],
    ]);

    for (let r = 0; r < 10; r += 1) {
      checkRect(nestedArea.rects[r], 'D', r * 105, 0, r === 9 ? 0 : bladeWidth, bladeWidth);
    }
    for (let r = 10; r < 20; r += 1) {
      checkRect(
        nestedArea.rects[r],
        'D',
        (r - 10) * 105,
        55,
        r === 19 ? 0 : bladeWidth,
        bladeWidth,
      );
    }

    const nestedArea1 = nestedArea.nestedAreas[0];
    checkArea(nestedArea1, 1010, 490, 0, 110, bladeWidth, 0, 4, 1);
    checkRemainingWidth(nestedArea1, [
      [0, 0],
      [100, 115],
      [395, 115],
      [489, 115],
    ]);

    checkRect(nestedArea1.rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea1.rects[1], 'C', 505, 0, 0, bladeWidth);
    checkRect(nestedArea1.rects[2], 'B', 0, 65, bladeWidth, bladeWidth);
    checkRect(nestedArea1.rects[3], 'B', 505, 65, 0, bladeWidth);

    const nestedArea2 = nestedArea1.nestedAreas[0];
    checkArea(nestedArea2, 890, 390, 0, 100, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedArea2, [
      [0, 0],
      [389, 0],
    ]);

    checkRect(nestedArea2.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[1], 'A', 445, 0, 0, 0);
  });

  it('should pack all items in the most compact way (GT25)', () => {
    const rects = getRects(testItems.gt25);
    const grouped = getSheetArea(testItems.gt25);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [
      [0, 950],
      [566, 950],
      [599, 950],
      [600, NaN],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 1050, 600, 0, 0, bladeWidth, 0, 20, 1);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [110, 35],
      [395, 35],
      [489, 35],
      [599, 35],
    ]);

    for (let r = 0; r < 10; r += 1) {
      checkRect(nestedArea.rects[r], 'D', r * 105, 0, r === 9 ? 0 : bladeWidth, bladeWidth);
    }
    for (let r = 10; r < 20; r += 1) {
      checkRect(
        nestedArea.rects[r],
        'D',
        (r - 10) * 105,
        55,
        r === 19 ? 0 : bladeWidth,
        bladeWidth,
      );
    }

    const nestedArea1 = nestedArea.nestedAreas[0];
    checkArea(nestedArea1, 1010, 490, 0, 110, bladeWidth, 0, 4, 2);
    checkRemainingWidth(nestedArea1, [
      [0, 0],
      [100, 0],
      [155, 115],
      [395, 115],
      [489, 115],
    ]);

    checkRect(nestedArea1.rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(nestedArea1.rects[1], 'C', 505, 0, 0, bladeWidth);
    checkRect(nestedArea1.rects[2], 'B', 0, 65, bladeWidth, bladeWidth);
    checkRect(nestedArea1.rects[3], 'B', 505, 65, 0, bladeWidth);

    const nestedArea2 = nestedArea1.nestedAreas[0];
    checkArea(nestedArea2, 890, 390, 0, 100, bladeWidth, 0, 2, 0);
    checkRemainingWidth(nestedArea2, [
      [0, 0],
      [389, 0],
    ]);

    checkRect(nestedArea2.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[1], 'A', 445, 0, 0, 0);

    const nestedArea3 = nestedArea1.nestedAreas[1];
    checkArea(nestedArea3, 115, 55, 890, 100, 0, bladeWidth, 1, 0);
    checkRemainingWidth(nestedArea3, [
      [0, 10],
      [49, 10],
    ]);

    checkRect(nestedArea3.rects[0], 'D', 0, 0, bladeWidth, 0);
  });
});

describe('Grouper for OSB sheets', () => {
  it('should group sheet 1 correct', () => {
    const rects = getRects(osbItems.s1);
    const grouped = getSheetArea(osbItems.s1);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 2);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 1750, 665, 0, 0, bladeWidth, 0, 2, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[1], 'A', 875, 0, 0, bladeWidth);

    const area3 = grouped.nestedAreas[1];
    checkArea(area3, 290, 625, 1750, 0, 0, bladeWidth, 2, 0);
    checkRect(area3.rects[0], 'B', 0, 0, bladeWidth, 0);
    checkRect(area3.rects[1], 'C', 205, 0, bladeWidth, 0);
  });

  it('should group sheet 2 correct', () => {
    const rects = getRects(osbItems.s2);
    const grouped = getSheetArea(osbItems.s2);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, bladeWidth, 5, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 850, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'C', 1905, 0, bladeWidth, 0);
    checkRect(area1.rects[4], 'C', 1970, 0, bladeWidth, 0);
  });

  it('should group sheet 3 correct', () => {
    const rects = getRects(osbItems.s3);
    const grouped = getSheetArea(osbItems.s3);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, bladeWidth, 6, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'D', 850, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'E', 1055, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'C', 1160, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[4], 'C', 1160, 263, bladeWidth, bladeWidth);
    checkRect(area1.rects[5], 'B', 1160, 526, bladeWidth, 2);
  });

  it('should group sheet 4 correct', () => {
    const rects = getRects(osbItems.s4);
    const grouped = getSheetArea(osbItems.s4);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, bladeWidth, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 850, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'C', 1905, 0, bladeWidth, 0);
  });

  it('should group sheet 5 correct', () => {
    const rects = getRects(osbItems.s5);
    const grouped = getSheetArea(osbItems.s5);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, 0, bladeWidth, 5, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'A', 850, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'B', 1700, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'B', 1805, 0, bladeWidth, 0);
    checkRect(area1.rects[4], 'B', 1910, 0, bladeWidth, 0);
  });

  it('should group sheet 6 correct', () => {
    const rects = getRects(osbItems.s6);
    const grouped = getSheetArea(osbItems.s6);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 625, 0, 0, bladeWidth, bladeWidth, 9, 1);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, 0);
    checkRect(area1.rects[1], 'D', 850, 0, bladeWidth, 0);
    checkRect(area1.rects[2], 'D', 955, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'D', 1060, 0, bladeWidth, 0);
    checkRect(area1.rects[4], 'C', 1165, 0, 4, bladeWidth);
    checkRect(area1.rects[5], 'C', 1165, 149, 4, bladeWidth);
    checkRect(area1.rects[6], 'C', 1165, 298, 4, bladeWidth);
    checkRect(area1.rects[7], 'B', 1165, 447, 0, bladeWidth);
    checkRect(area1.rects[8], 'B', 1165, 502, 0, bladeWidth);

    checkArea(area1.nestedAreas[0], 870, 63, 1165, 557, 0, 3, 1, 0);
    checkRect(area1.nestedAreas[0].rects[0], 'E', 0, 0, bladeWidth, 0);
  });

  it('should group sheet 7 correct', () => {
    const rects = getRects(osbItems.s7);
    const grouped = getSheetArea(osbItems.s7);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 3);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 871, 665, 0, 0, bladeWidth, 0, 3, 1);
    checkRect(area1.rects[0], 'F', 0, 0, 0, bladeWidth);
    checkRect(area1.rects[1], 'F', 0, 149, 0, bladeWidth);
    checkRect(area1.rects[2], 'F', 0, 298, 0, bladeWidth);

    checkArea(area1.nestedAreas[0], 826, 218, 0, 447, bladeWidth, 0, 1, 0);
    checkRect(area1.nestedAreas[0].rects[0], 'C', 0, 0, 0, bladeWidth);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 875, 665, 871, 0, bladeWidth, 0, 2, 1);
    checkRect(area2.rects[0], 'D', 0, 0, 0, bladeWidth);
    checkRect(area2.rects[1], 'D', 0, 55, 0, bladeWidth);

    checkArea(area2.nestedAreas[0], 870, 480, 0, 110, 0, bladeWidth, 4, 0);
    checkRect(area2.nestedAreas[0].rects[0], 'C', 0, 0, bladeWidth, bladeWidth);
    checkRect(area2.nestedAreas[0].rects[1], 'B', 0, 205, bladeWidth, bladeWidth);
    checkRect(area2.nestedAreas[0].rects[2], 'B', 0, 310, bladeWidth, bladeWidth);
    checkRect(area2.nestedAreas[0].rects[3], 'E', 0, 415, bladeWidth, 0);

    const area3 = grouped.nestedAreas[2];
    checkArea(area3, 170, 665, 1746, 0, bladeWidth, 0, 2, 0);
    checkRect(area3.rects[0], 'G', 0, 0, bladeWidth, bladeWidth);
    checkRect(area3.rects[1], 'A', 105, 0, 0, bladeWidth);
  });

  it('should group sheet 8 correct', () => {
    const rects = getRects(osbItems.s8);
    const grouped = getSheetArea(osbItems.s8);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 2);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 826, 665, 0, 0, bladeWidth, 0, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, 0, bladeWidth);
    checkRect(area1.rects[1], 'A', 0, 205, 0, bladeWidth);
    checkRect(area1.rects[2], 'C', 0, 410, 0, bladeWidth);
    checkRect(area1.rects[3], 'C', 0, 515, 0, bladeWidth);

    const area2 = grouped.nestedAreas[1];
    checkArea(area2, 826, 665, 826, 0, bladeWidth, 0, 7, 0);
    checkRect(area2.rects[0], 'C', 0, 0, 0, bladeWidth);
    checkRect(area2.rects[1], 'C', 0, 105, 0, bladeWidth);
    checkRect(area2.rects[2], 'C', 0, 210, 0, bladeWidth);
    checkRect(area2.rects[3], 'C', 0, 315, 0, bladeWidth);
    checkRect(area2.rects[4], 'C', 0, 420, 0, bladeWidth);
    checkRect(area2.rects[5], 'B', 0, 525, 0, bladeWidth);
    checkRect(area2.rects[6], 'B', 0, 590, 0, bladeWidth);
  });

  it('should group sheet 9 correct', () => {
    const rects = getRects(osbItems.s9);
    const grouped = getSheetArea(osbItems.s9);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 871, 665, 0, 0, bladeWidth, 0, 1, 1);
    checkRect(area1.rects[0], 'B', 0, 0, 0, bladeWidth);

    checkArea(area1.nestedAreas[0], 866, 315, 0, 97, 0, bladeWidth, 3, 0);
    checkRect(area1.nestedAreas[0].rects[0], 'A', 0, 0, bladeWidth, bladeWidth);
    checkRect(area1.nestedAreas[0].rects[1], 'A', 0, 105, bladeWidth, bladeWidth);
    checkRect(area1.nestedAreas[0].rects[2], 'A', 0, 210, bladeWidth, 0);
  });

  it('should group sheet 10 correct', () => {
    const rects = getRects(osbItems.s10);
    const grouped = getSheetArea(osbItems.s10);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 1810, 665, 0, 0, bladeWidth, 0, 2, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[1], 'A', 905, 0, 0, bladeWidth);
  });

  it('should group sheet 11 correct', () => {
    const rects = getRects(osbItems.s11);
    const grouped = getSheetArea(osbItems.s11);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 2040, 665, 0, 0, 0, 0, 0, 1);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 2040, 210, 0, 0, 0, bladeWidth, 4, 0);
    checkRect(area1.rects[0], 'A', 0, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[1], 'A', 875, 0, bladeWidth, bladeWidth);
    checkRect(area1.rects[2], 'A', 0, 105, bladeWidth, 0);
    checkRect(area1.rects[3], 'A', 875, 105, bladeWidth, 0);
  });
});
