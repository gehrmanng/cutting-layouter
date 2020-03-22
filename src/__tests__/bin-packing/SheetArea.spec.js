import { SheetArea, Rect } from '../../bin-packing';

describe('SheetArea', () => {
  const bladeWidth = 5;

  const checkGrid = (grid, top, bottom, width) => {
    for (let i = top; i < bottom; i += 1) {
      try {
        expect(grid[i]).toBe(width);
      } catch (e) {
        throw new Error(`Expected used width at ${i} to be ${width} but was ${grid[i]}`);
      }
    }
  };

  it('should not be able to extend the height', () => {
    const area = new SheetArea(100, 100, 100, bladeWidth);

    expect(area.extendHeight(10)).toBeFalsy();
    expect(area.height).toBe(100);
    checkGrid(area._grid, 0, 100, 0);
  });

  it('should extend the height by 10', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);

    const result = area.extendHeight(10);
    expect(result).toBeTruthy();
    expect(area.height).toBe(100);
    checkGrid(area._grid, 0, 100, 0);
  });

  it('should not be able to extend the height if it exeeds the parents height', () => {
    const parent = new SheetArea(100, 90, 90, bladeWidth);
    const area = new SheetArea(50, 90, 100, bladeWidth, parent);
    parent.addNestedArea(area);

    const result = area.extendHeight(10);
    expect(result).toBeFalsy();
  });

  it('should extend the height by 10 and update parents grid', () => {
    const parent = new SheetArea(100, 100, 100, bladeWidth);
    const area = new SheetArea(50, 90, 100, bladeWidth, parent);
    parent.addNestedArea(area);

    const result = area.extendHeight(10);
    expect(result).toBeTruthy();
    expect(area.height).toBe(100);
    checkGrid(area._grid, 0, 100, 0);
    checkGrid(parent._grid, 0, 100, 55);
  });

  it('should remove the bottom cut', () => {
    const parent = new SheetArea(100, 100, 100, bladeWidth);
    const area = new SheetArea(50, 90, 100, bladeWidth, parent);
    parent.addNestedArea(area);

    expect(area.height).toBe(90);
    expect(area.fullHeight).toBe(95);
    expect(area.cuttingWidth.bottom).toBe(5);

    checkGrid(parent._grid, 0, 95, 55);
    checkGrid(parent._grid, 95, 100, 0);

    expect(area.extendHeight(10)).toBeTruthy();
    expect(area.height).toBe(100);
    expect(area.fullHeight).toBe(100);
    checkGrid(area._grid, 0, 100, 0);
    checkGrid(parent._grid, 0, 100, 55);

    expect(area.cuttingWidth.bottom).toBe(0);
  });

  it('should add a bottom cut to a contained rect', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    area.addRect(new Rect(null, 100, 90, 0, 0));

    expect(area.rects[0].fullHeight).toBe(90);
    expect(area.rects[0].cuttingWidth.bottom).toBe(0);
    checkGrid(area._grid, 0, 90, 100);

    expect(area.extendHeight(5)).toBeTruthy();
    expect(area.height).toBe(100);
    expect(area.fullHeight).toBe(100);
    expect(area.rects[0].height).toBe(90);
    expect(area.rects[0].fullHeight).toBe(95);
    expect(area.rects[0].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(area._grid, 0, 95, 100);
    checkGrid(area._grid, 95, 100, 0);
  });

  it('should add a bottom cut to a contained sheet area', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    area.addNestedArea(new SheetArea(100, 90, 90, bladeWidth, area));

    expect(area.nestedAreas[0].fullHeight).toBe(90);
    expect(area.nestedAreas[0].cuttingWidth.bottom).toBe(0);
    checkGrid(area._grid, 0, 90, 100);

    expect(area.extendHeight(5)).toBeTruthy();
    expect(area.height).toBe(100);
    expect(area.fullHeight).toBe(100);
    expect(area.nestedAreas[0].height).toBe(90);
    expect(area.nestedAreas[0].fullHeight).toBe(95);
    expect(area.nestedAreas[0].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(area._grid, 0, 95, 100);
    checkGrid(area._grid, 95, 100, 0);
  });

  it('should add a cut border to a contained rect and keep a shorter rect as it is', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    area.addRect(new Rect(null, 45, 90, 0, 0));
    area.addRect(new Rect(null, 50, 80, 0, 0));

    expect(area.rects[0].fullHeight).toBe(90);
    expect(area.rects[0].cuttingWidth.bottom).toBe(0);
    expect(area.rects[1].fullHeight).toBe(85);
    expect(area.rects[1].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(area._grid, 0, 85, 100);
    checkGrid(area._grid, 85, 90, 50);

    expect(area.extendHeight(5)).toBeTruthy();
    expect(area.height).toBe(100);
    expect(area.fullHeight).toBe(100);
    expect(area.rects[0].height).toBe(90);
    expect(area.rects[0].fullHeight).toBe(95);
    expect(area.rects[0].cuttingWidth.bottom).toBe(bladeWidth);
    expect(area.rects[1].height).toBe(80);
    expect(area.rects[1].fullHeight).toBe(85);
    expect(area.rects[1].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(area._grid, 0, 85, 100);
    checkGrid(area._grid, 85, 95, 50);
    checkGrid(area._grid, 95, 100, 0);
  });

  it('should extend a partial cut to a full cut of a contained rect', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    area.addRect(new Rect(null, 100, 88, 0, 0));

    expect(area.rects[0].fullHeight).toBe(90);
    expect(area.rects[0].cuttingWidth.bottom).toBe(2);
    checkGrid(area._grid, 0, 90, 100);

    expect(area.extendHeight(7)).toBeTruthy();
    expect(area.height).toBe(100);
    expect(area.fullHeight).toBe(100);
    expect(area.rects[0].height).toBe(88);
    expect(area.rects[0].fullHeight).toBe(93);
    expect(area.rects[0].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(area._grid, 0, 93, 100);
    checkGrid(area._grid, 93, 100, 0);
  });

  it('should extend nested and parent areas correctly', () => {
    const materialArea = new SheetArea(2000, 600, 600, bladeWidth);
    const itemArea = new SheetArea(885, 390, materialArea.height, bladeWidth, materialArea);
    materialArea.addNestedArea(itemArea);

    itemArea.addRect(new Rect(null, 440, 390, 0, 0, 'B', 0));
    itemArea.addRect(new Rect(null, 440, 390, 445, 0, 'B', 1));

    expect(itemArea.fullHeight).toBe(395);
    checkGrid(itemArea._grid, 0, 390, 885);
    checkGrid(materialArea._grid, 0, 395, 890);
    checkGrid(materialArea._grid, 395, 600, 0);

    const firstNestedArea = new SheetArea(740, 100, 205, bladeWidth, itemArea);
    firstNestedArea.addRect(new Rect(null, 740, 100, 0, 0, 'D'));

    expect(itemArea.extendHeight(undefined, firstNestedArea)).toBeTruthy();
    expect(itemArea.height).toBe(495);
    expect(itemArea.fullHeight).toBe(500);
    expect(itemArea.rects[0].cuttingWidth.bottom).toBe(bladeWidth);
    expect(itemArea.rects[1].cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(itemArea._grid, 390, 395, 885);
    checkGrid(itemArea._grid, 395, 495, 0);
    checkGrid(materialArea._grid, 395, 500, 890);
    checkGrid(materialArea._grid, 500, 600, 0);

    itemArea.addNestedArea(firstNestedArea);
    expect(firstNestedArea.cuttingWidth.bottom).toBe(0);
    checkGrid(itemArea._grid, 395, 495, 745);

    const secondNestedArea = new SheetArea(700, 60, 100, firstNestedArea);
    secondNestedArea.addRect(new Rect(null, 700, 60, 0, 0, 'C'));

    expect(firstNestedArea.extendHeight(undefined, secondNestedArea)).toBeTruthy();
    expect(firstNestedArea.height).toBe(165);
    expect(firstNestedArea.fullHeight).toBe(165);
    expect(firstNestedArea.rects[0].cuttingWidth.bottom).toBe(bladeWidth);
    expect(itemArea.height).toBe(560);
    expect(itemArea.fullHeight).toBe(565);
    checkGrid(firstNestedArea._grid, 100, 105, 740);
    checkGrid(firstNestedArea._grid, 105, 165, 0);
    checkGrid(itemArea._grid, 495, 560, 745);
    checkGrid(materialArea._grid, 495, 565, 890);
    checkGrid(materialArea._grid, 565, 600, 0);

    firstNestedArea.addNestedArea(secondNestedArea);
    expect(firstNestedArea.height).toBe(165);
    expect(firstNestedArea.fullHeight).toBe(165);
    checkGrid(firstNestedArea._grid, 100, 105, 740);
    checkGrid(firstNestedArea._grid, 105, 165, 705);
    checkGrid(itemArea._grid, 495, 560, 745);

    expect(secondNestedArea.extendHeight(60)).toBeFalsy();
  });

  it('should update the parent grid incl bottom cutting width', () => {
    const materialArea = new SheetArea(2500, 1250, 1250, bladeWidth);
    const itemArea = new SheetArea(1695, 620, materialArea.height, bladeWidth, materialArea);
    materialArea.addNestedArea(itemArea);

    itemArea.addRect(new Rect(null, 845, 620, 0, 0, 'C', 0));
    itemArea.addRect(new Rect(null, 845, 620, 850, 0, 'C', 1));

    expect(itemArea.fullHeight).toBe(625);
    checkGrid(itemArea._grid, 0, 620, 1695);
    checkGrid(materialArea._grid, 0, 625, 1700);
    checkGrid(materialArea._grid, 625, 1250, 0);

    expect(itemArea.extendHeight(620)).toBeTruthy();
    itemArea.addRect(new Rect(null, 845, 620, 0, 625, 'C', 2));
    itemArea.addRect(new Rect(null, 845, 620, 850, 625, 'C', 3));

    expect(itemArea.height).toBe(1245);
    expect(itemArea.fullHeight).toBe(1250);
    expect(itemArea.cuttingWidth.bottom).toBe(bladeWidth);
    checkGrid(itemArea._grid, 620, 1245, 1695);
    checkGrid(materialArea._grid, 625, 1250, 1700);
  });
});
