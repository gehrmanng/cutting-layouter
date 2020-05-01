import { Grouper, Rect, SheetArea } from '../../bin-packing';

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
  const bladeWidth = 5;
  const grouper = new Grouper(bladeWidth);

  const createSheetArea = (width, height) => {
    return new SheetArea(width, height, height, bladeWidth, undefined, 0);
  };

  it('should pack three items into a matching sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    const grouped = createSheetArea(610, 100);
    grouper.group(rects, grouped);
    checkArea(grouped, 610, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 105, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'C', 310, 0, 0, 0, 0, 0);
  });

  it('should pack three items into a wider sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    const grouped = createSheetArea(700, 100);
    grouper.group(rects, grouped);

    checkArea(grouped, 700, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 85]]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 105, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'C', 310, 0, 0, bladeWidth, 0, 0);
  });

  it('should pack three items into a little bit wider sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    const grouped = createSheetArea(613, 100);
    grouper.group(rects, grouped);

    checkArea(grouped, 613, 100, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'A', 0, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[1], 'B', 105, 0, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[2], 'C', 310, 0, 0, 3, 0, 0);
  });

  it('should pack three items into a higher sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    const grouped = createSheetArea(610, 200);
    grouper.group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 0, 0, 3, 0);
    checkRemainingWidth(grouped, [[0, 0]]);

    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 0, bladeWidth, 0);
  });

  it('should pack six items into two rows', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
      Rect.create('D', 300, 95),
      Rect.create('E', 200, 95),
      Rect.create('F', 100, 95),
    ];

    const grouped = createSheetArea(610, 200);
    grouper.group(rects, grouped);

    checkArea(grouped, 610, 200, 0, 0, 0, 0, 0, 0, 6, 0);
    checkRemainingWidth(grouped, [
      [0, 0],
      [105, 0],
    ]);

    checkRect(grouped.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[1], 'B', 305, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'A', 510, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[3], 'D', 0, 105, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[4], 'E', 305, 105, 0, bladeWidth, 0, 0);
    checkRect(grouped.rects[5], 'F', 510, 105, 0, 0, 0, 0);
  });

  it('should pack six items into two rows in a bigger sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
      Rect.create('D', 300, 95),
      Rect.create('E', 200, 95),
      Rect.create('F', 100, 95),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

    checkArea(grouped, 2000, 600, 0, 0, 0, 0, 0, 0, 0, 1);
    checkRemainingWidth(grouped, [[0, 1385]]);

    const area1 = grouped.nestedAreas[0];
    checkArea(area1, 615, 600, 0, 0, 0, bladeWidth, 0, 0, 6, 0);

    checkRect(area1.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[1], 'B', 305, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[2], 'A', 510, 0, 0, 0, bladeWidth, 0);
    checkRect(area1.rects[3], 'D', 0, 105, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[4], 'E', 305, 105, 0, bladeWidth, bladeWidth, 0);
    checkRect(area1.rects[5], 'F', 510, 105, 0, 0, bladeWidth, 0);
  });

  it('should pack three items into a wider and higher sheet', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    const grouped = createSheetArea(700, 200);
    grouper.group(rects, grouped);

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
    const rects = [Rect.create('A', 200, 400), Rect.create('B', 50, 350)];

    const grouped = createSheetArea(700, 400);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 200, 400),
      Rect.create('B', 50, 350),
      Rect.create('C', 80, 350),
    ];

    const grouped = createSheetArea(700, 400);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 440, 390),
      Rect.create('B', 440, 390),
      Rect.create('C', 700, 60),
      Rect.create('C', 700, 60),
      Rect.create('D', 740, 100),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [Rect.create('A', 1000, 50), Rect.create('B', 50, 535)];

    const grouped = createSheetArea(1000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 1095, 50),
      Rect.create('C', 50, 535),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 1095, 50),
      Rect.create('B', 1095, 50),
      Rect.create('C', 50, 480),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 595, 50),
      Rect.create('C', 395, 50),
      Rect.create('D', 95, 50),
      Rect.create('E', 1095, 50),
      Rect.create('F', 50, 480),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 1095, 50),
      Rect.create('C', 50, 535),
      Rect.create('D', 100, 50),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 845, 620),
      Rect.create('A', 845, 620),
      Rect.create('A', 845, 620),
      Rect.create('A', 845, 620),
    ];

    const grouped = createSheetArea(2500, 1250);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 620, 200),
      Rect.create('A', 620, 200),
      Rect.create('A', 620, 200),
      Rect.create('A', 620, 200),
      Rect.create('B', 620, 100),
      Rect.create('B', 620, 100),
      Rect.create('B', 620, 100),
      Rect.create('B', 620, 100),
      Rect.create('C', 845, 620),
      Rect.create('C', 845, 620),
      Rect.create('C', 845, 620),
      Rect.create('C', 845, 620),
    ];

    const grouped = createSheetArea(2500, 1250);
    grouper.group(rects, grouped);

    checkArea(grouped, 2500, 1250, 0, 0, 0, 0, 0, 0, 0, 2);
    checkRemainingWidth(grouped, [
      [0, 175],
      [1000, 175],
      [1249, 175],
    ]);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 1700, 1250, 0, 0, 0, bladeWidth, bladeWidth, 0, 4, 0);
    checkRemainingWidth(nestedArea, [
      [0, 0],
      [1000, 0],
      [1244, 0],
    ]);

    checkRect(nestedArea.rects[0], 'C', 0, 0, 0, bladeWidth, bladeWidth, 0);
    checkRect(nestedArea.rects[1], 'C', 850, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea.rects[2], 'C', 0, 625, 0, bladeWidth, 0, 0);
    checkRect(nestedArea.rects[3], 'C', 850, 625, 0, 0, 0, 0);

    const nestedArea2 = grouped.nestedAreas[1];
    checkArea(nestedArea2, 625, 1250, 1700, 0, 0, bladeWidth, 0, 0, 8, 0);
    checkRemainingWidth(nestedArea2, [
      [0, 0],
      [1000, 0],
      [1249, 620],
    ]);

    checkRect(nestedArea2.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[1], 'A', 0, 205, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[2], 'A', 0, 410, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[3], 'A', 0, 615, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[4], 'B', 0, 820, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[5], 'B', 0, 925, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[6], 'B', 0, 1030, 0, 0, bladeWidth, 0);
    checkRect(nestedArea2.rects[7], 'B', 0, 1135, 0, 0, bladeWidth, 0);
  });

  it('should pack 7 of 7 items', () => {
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 440, 390),
      Rect.create('B', 440, 390),
      Rect.create('C', 700, 60),
      Rect.create('C', 700, 60),
      Rect.create('D', 740, 30),
      Rect.create('D', 740, 30),
    ];

    const grouped = createSheetArea(2000, 600);
    grouper.group(rects, grouped);

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
    const rects = [
      Rect.create('A', 740, 30),
      Rect.create('B', 700, 60),
      Rect.create('B', 700, 60),
      Rect.create('C', 368, 30),
      Rect.create('D', 367, 30),
    ];

    const grouped = createSheetArea(740, 205);

    new Grouper(bladeWidth).group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'C', 0, 165, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'D', 373, 165, 0, 0, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 740, 130, 0, 35, 0, 0, bladeWidth, 0, 2, 0);
  });

  it('should use full width if rects plus cutting width are >= full width', () => {
    const rects = [
      Rect.create('A', 740, 30),
      Rect.create('B', 700, 60),
      Rect.create('B', 700, 60),
      Rect.create('C', 367, 30),
      Rect.create('C', 367, 30),
    ];

    const grouped = createSheetArea(740, 205);
    grouper.group(rects, grouped);

    checkArea(grouped, 740, 205, 0, 0, 0, 0, 0, 0, 3, 1);
    checkRect(grouped.rects[0], 'A', 0, 0, 0, 0, bladeWidth, 0);
    checkRect(grouped.rects[1], 'C', 0, 165, 0, bladeWidth, bladeWidth, 0);
    checkRect(grouped.rects[2], 'C', 372, 165, 0, 1, bladeWidth, 0);

    const nestedArea = grouped.nestedAreas[0];
    checkArea(nestedArea, 740, 130, 0, 35, 0, 0, bladeWidth, 0, 2, 0);
  });
});
