import { SheetArea, Rect } from '../../bin-packing';

describe('SheetArea#removeChildren', () => {
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

  it('should remove a rect from its parent area', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const rect = new Rect(null, 90, 90);
    area.addRect(rect);

    checkGrid(area._grid, 0, 90, 95);

    const removed = area.removeChildren(rect.bottomPosition + 1, 100);
    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe(rect.id);

    checkGrid(area._grid, 0, 90, 0);
  });

  it('should remove a nested area from its parent', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const nestedArea = new SheetArea(90, 50, 90, bladeWidth, area);
    const rect = new Rect(null, 90, 50);
    nestedArea.addRect(rect);
    area.addNestedArea(nestedArea);

    checkGrid(area._grid, 0, 55, 95);
    checkGrid(area._grid, 55, 90, 0);

    const removed = area.removeChildren(nestedArea.bottomPosition + 1, 100);
    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe(rect.id);

    checkGrid(area._grid, 0, 90, 0);
  });

  it('should remove one rect and keep the other', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const rect1 = new Rect(null, 90, 40);
    const rect2 = new Rect(null, 100, 40);
    area.addRect(rect1);
    area.addRect(rect2);

    checkGrid(area._grid, 0, 45, 95);
    checkGrid(area._grid, 45, 90, 100);

    const removed = area.removeChildren(rect2.posY, 100);
    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe(rect1.id);

    checkGrid(area._grid, 0, 45, 0);
    checkGrid(area._grid, 45, 90, 100);
  });

  it('should remove two parallel rects and keep one other', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const rect1 = new Rect(null, 40, 40);
    const rect2 = new Rect(null, 40, 40);
    const rect3 = new Rect(null, 100, 40);
    area.addRect(rect1);
    area.addRect(rect2);
    area.addRect(rect3);

    checkGrid(area._grid, 0, 45, 90);
    checkGrid(area._grid, 45, 90, 100);
    expect(area.rects[0].posX).toBe(0);
    expect(area.rects[0].posY).toBe(0);
    expect(area.rects[1].posX).toBe(45);
    expect(area.rects[1].posY).toBe(0);
    expect(area.rects[2].posX).toBe(0);
    expect(area.rects[2].posY).toBe(45);

    const removed = area.removeChildren(rect3.posY, 100);
    expect(removed).toHaveLength(2);
    expect(removed[0].id).toBe(rect1.id);
    expect(removed[1].id).toBe(rect2.id);

    checkGrid(area._grid, 0, 45, 0);
    checkGrid(area._grid, 45, 90, 100);
  });

  it('should remove one nested area and one rect from their parent', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const nestedArea = new SheetArea(90, 50, 50, bladeWidth, area);
    const rect1 = new Rect(null, 90, 50);
    nestedArea.addRect(rect1);
    area.addNestedArea(nestedArea);
    const rect2 = new Rect(null, 90, 35);
    area.addRect(rect2);

    checkGrid(area._grid, 0, 90, 95);

    const removed = area.removeChildren(rect2.bottomPosition + 1, 100);
    expect(removed).toHaveLength(2);
    expect(removed[0].id).toBe(rect1.id);
    expect(removed[1].id).toBe(rect2.id);

    checkGrid(area._grid, 0, 90, 0);
  });

  it('should remove one small rect and keep one bigger', () => {
    const area = new SheetArea(100, 90, 100, bladeWidth);
    const rect1 = new Rect(null, 100, 40);
    const rect2 = new Rect(null, 90, 40);
    area.addRect(rect1);
    area.addRect(rect2);

    checkGrid(area._grid, 0, 45, 100);
    checkGrid(area._grid, 45, 90, 95);

    const removed = area.removeChildren(rect2.bottomPosition, 99);
    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe(rect2.id);

    checkGrid(area._grid, 0, 45, 100);
    checkGrid(area._grid, 45, 90, 0);
  });
});
