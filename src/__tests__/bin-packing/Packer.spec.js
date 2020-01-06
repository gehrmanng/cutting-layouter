import { Item, Material, Packer } from '../../bin-packing';

const checkBorder = (actual, top, right, bottom, left) => {
  expect(actual).toEqual({ top, right, bottom, left });
};
/*
describe('Packer', () => {
  it('should pack three items into a matching sheet', () => {
    const material = new Material(1, 'testMaterial', 610, 100, 10);
    const items = [
      new Item('A', 100, 100, 1, 1),
      new Item('B', 200, 100, 1, 1),
      new Item('C', 300, 100, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(3);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(100);
    expect(sheetArea.remainingWidth).toBe(0);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    const { rects } = sheetArea;
    expect(rects[0].posX).toBe(0);
    checkBorder(rects[0].border, 0, 5, 0, 0);
    expect(rects[1].posX).toBe(305);
    checkBorder(rects[1].border, 0, 5, 0, 0);
    expect(rects[2].posX).toBe(510);
    checkBorder(rects[2].border, 0, 0, 0, 0);
  });

  it('should pack three items into a wider sheet', () => {
    const material = new Material(1, 'testMaterial', 700, 100, 10);
    const items = [
      new Item('A', 100, 100, 1, 1),
      new Item('B', 200, 100, 1, 1),
      new Item('C', 300, 100, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(3);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(100);
    expect(sheetArea.remainingWidth).toBe(85);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    const { rects } = sheetArea;
    expect(rects[0].posX).toBe(0);
    checkBorder(rects[0].border, 0, 5, 0, 0);
    expect(rects[1].posX).toBe(305);
    checkBorder(rects[1].border, 0, 5, 0, 0);
    expect(rects[2].posX).toBe(510);
    checkBorder(rects[2].border, 0, 5, 0, 0);
  });

  it('should pack three items into a higher sheet', () => {
    const material = new Material(1, 'testMaterial', 610, 200, 10);
    const items = [
      new Item('A', 100, 100, 1, 1),
      new Item('B', 200, 100, 1, 1),
      new Item('C', 300, 100, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(0);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.remainingWidth).toBe(0);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const { nestedSheetAreas } = sheetArea;
    const nestedSheetArea = nestedSheetAreas[0];
    expect(nestedSheetArea.posX).toBe(0);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.height).toBe(100);
    expect(nestedSheetArea.fullHeight).toBe(105);
    checkBorder(nestedSheetArea.border, 0, 0, 5, 0);
    expect(nestedSheetArea.rects).toHaveLength(3);
    expect(nestedSheetArea.rects[0].posX).toBe(0);
    checkBorder(nestedSheetArea.rects[0].border, 0, 5, 0, 0);
    expect(nestedSheetArea.rects[1].posX).toBe(305);
    checkBorder(nestedSheetArea.rects[1].border, 0, 5, 0, 0);
    expect(nestedSheetArea.rects[2].posX).toBe(510);
    checkBorder(nestedSheetArea.rects[2].border, 0, 0, 0, 0);
  });

  it('should pack three items into a wider and higher sheet', () => {
    const material = new Material(1, 'testMaterial', 700, 200, 10);
    const items = [
      new Item('A', 100, 100, 1, 1),
      new Item('B', 200, 100, 1, 1),
      new Item('C', 300, 100, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(0);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.remainingWidth).toBe(0);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const { nestedSheetAreas } = sheetArea;
    const nestedSheetArea = nestedSheetAreas[0];
    expect(nestedSheetArea.posX).toBe(0);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.height).toBe(100);
    expect(nestedSheetArea.fullHeight).toBe(105);
    expect(nestedSheetArea.remainingWidth).toBe(85);
    checkBorder(nestedSheetArea.border, 0, 0, 5, 0);
    expect(nestedSheetArea.rects).toHaveLength(3);
    expect(nestedSheetArea.rects[0].posX).toBe(0);
    checkBorder(nestedSheetArea.rects[0].border, 0, 5, 0, 0);
    expect(nestedSheetArea.rects[1].posX).toBe(305);
    checkBorder(nestedSheetArea.rects[1].border, 0, 5, 0, 0);
    expect(nestedSheetArea.rects[2].posX).toBe(510);
    checkBorder(nestedSheetArea.rects[2].border, 0, 5, 0, 0);
  });

  it('should pack two items, one smaller then the other', () => {
    const material = new Material(1, 'testMaterial', 700, 400, 10);
    const items = [new Item('A', 200, 400, 1, 1), new Item('B', 50, 350, 1, 1)];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(1);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.remainingWidth).toBe(440);
    const { rects } = sheetArea;
    expect(rects[0].width).toBe(200);
    expect(rects[0].fullWidth).toBe(205);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const nestedSheetArea = sheetArea.nestedSheetAreas[0];
    expect(nestedSheetArea.rects).toHaveLength(1);
    expect(nestedSheetArea.width).toBe(50);
    expect(nestedSheetArea.height).toBe(material.height);
    expect(nestedSheetArea.fullHeight).toBe(material.height);
    expect(nestedSheetArea.posX).toBe(205);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.remainingWidth).toBe(0);
    checkBorder(nestedSheetArea.border, 0, 5, 0, 0);
    const nestedRect = nestedSheetArea.rects[0];
    expect(nestedRect.posX).toBe(0);
    expect(nestedRect.posY).toBe(0);
    checkBorder(nestedRect.border, 0, 0, 5, 0);
  });

  it('should pack three items, two smaller then the first', () => {
    const material = new Material(1, 'testMaterial', 700, 400, 10);
    const items = [
      new Item('A', 200, 400, 1, 1),
      new Item('B', 50, 350, 1, 1),
      new Item('C', 80, 350, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(1);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.remainingWidth).toBe(355);
    const { rects } = sheetArea;
    expect(rects[0].width).toBe(200);
    expect(rects[0].fullWidth).toBe(205);
    expect(sheetArea.nestedSheetAreas).toHaveLength(2);
    const { nestedSheetAreas } = sheetArea;
    expect(nestedSheetAreas[0].rects).toHaveLength(1);
    expect(nestedSheetAreas[0].width).toBe(80);
    expect(nestedSheetAreas[0].height).toBe(material.height);
    expect(nestedSheetAreas[0].fullHeight).toBe(material.height);
    expect(nestedSheetAreas[0].posX).toBe(205);
    expect(nestedSheetAreas[0].posY).toBe(0);
    expect(nestedSheetAreas[0].remainingWidth).toBe(0);
    checkBorder(nestedSheetAreas[0].border, 0, 5, 0, 0);
    expect(nestedSheetAreas[0].rects[0].posX).toBe(0);
    expect(nestedSheetAreas[0].rects[0].posY).toBe(0);
    checkBorder(nestedSheetAreas[0].rects[0].border, 0, 0, 5, 0);
    expect(nestedSheetAreas[1].rects).toHaveLength(1);
    expect(nestedSheetAreas[1].width).toBe(50);
    expect(nestedSheetAreas[1].height).toBe(material.height);
    expect(nestedSheetAreas[1].fullHeight).toBe(material.height);
    expect(nestedSheetAreas[1].posX).toBe(290);
    expect(nestedSheetAreas[1].posY).toBe(0);
    expect(nestedSheetAreas[1].remainingWidth).toBe(0);
    checkBorder(nestedSheetAreas[1].border, 0, 5, 0, 0);
    expect(nestedSheetAreas[1].rects[0].posX).toBe(0);
    expect(nestedSheetAreas[1].rects[0].posY).toBe(0);
    checkBorder(nestedSheetAreas[1].rects[0].border, 0, 0, 5, 0);
  });

  it('should pack 5 of 6 items', () => {
    const material = new Material(1, 'testMaterial', 2000, 600, 20);
    const items = [
      new Item('A', 900, 600, 1, 1),
      new Item('B', 440, 390, 2, 1),
      new Item('D', 740, 100, 1, 1),
      new Item('C', 700, 60, 2, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(1);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.remainingWidth).toBe(205);
    const { rects } = sheetArea;
    expect(rects[0].width).toBe(900);
    expect(rects[0].fullWidth).toBe(905);
    checkBorder(rects[0].border, 0, 5, 0, 0);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const nestedSheetArea = sheetArea.nestedSheetAreas[0];
    expect(nestedSheetArea.nestedSheetAreas).toHaveLength(3);
    expect(nestedSheetArea.rects).toHaveLength(0);
    expect(nestedSheetArea.width).toBe(885);
    expect(nestedSheetArea.height).toBe(material.height);
    expect(nestedSheetArea.fullHeight).toBe(material.height);
    expect(nestedSheetArea.posX).toBe(905);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.remainingWidth).toBe(0);
    checkBorder(nestedSheetArea.border, 0, 5, 0, 0);
    nestedSheetArea.nestedSheetAreas.forEach(n => {
      expect(n.width).toEqual(nestedSheetArea.width);
      checkBorder(n.border, 0, 0, 5, 0);
    });
    const nestedNestedSheetAreas = nestedSheetArea.nestedSheetAreas;
    expect(nestedNestedSheetAreas[0].rects).toHaveLength(2);
    expect(nestedNestedSheetAreas[0].height).toBe(390);
    expect(nestedNestedSheetAreas[0].fullHeight).toBe(395);
    expect(nestedNestedSheetAreas[0].posX).toBe(0);
    expect(nestedNestedSheetAreas[0].posY).toBe(0);
    expect(nestedNestedSheetAreas[0].rects[0].width).toBe(440);
    checkBorder(nestedNestedSheetAreas[0].rects[0].border, 0, 5, 0, 0);
    checkBorder(nestedNestedSheetAreas[0].rects[1].border, 0, 0, 0, 0);
    expect(nestedNestedSheetAreas[1].rects).toHaveLength(1);
    expect(nestedNestedSheetAreas[1].height).toBe(100);
    expect(nestedNestedSheetAreas[1].fullHeight).toBe(105);
    expect(nestedNestedSheetAreas[1].posX).toBe(0);
    expect(nestedNestedSheetAreas[1].posY).toBe(395);
    expect(nestedNestedSheetAreas[1].rects[0].width).toBe(740);
    checkBorder(nestedNestedSheetAreas[1].rects[0].border, 0, 5, 0, 0);
    expect(nestedNestedSheetAreas[2].rects).toHaveLength(1);
    expect(nestedNestedSheetAreas[2].height).toBe(60);
    expect(nestedNestedSheetAreas[2].fullHeight).toBe(65);
    expect(nestedNestedSheetAreas[2].posX).toBe(0);
    expect(nestedNestedSheetAreas[2].posY).toBe(500);
    expect(nestedNestedSheetAreas[2].rects[0].width).toBe(700);
    checkBorder(nestedNestedSheetAreas[2].rects[0].border, 0, 5, 0, 0);
  });

  it('should pack 5 of 6 items, different item adding order', () => {
    const material = new Material(1, 'testMaterial', 2000, 600, 20);
    const items = [
      new Item('A', 900, 600, 1, 1),
      new Item('B', 440, 390, 2, 1),
      new Item('C', 700, 60, 2, 1),
      new Item('D', 740, 100, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(1);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.remainingWidth).toBe(205);
    const { rects } = sheetArea;
    expect(rects[0].width).toBe(900);
    expect(rects[0].fullWidth).toBe(905);
    checkBorder(rects[0].border, 0, 5, 0, 0);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const nestedSheetArea = sheetArea.nestedSheetAreas[0];
    expect(nestedSheetArea.nestedSheetAreas).toHaveLength(3);
    expect(nestedSheetArea.rects).toHaveLength(0);
    expect(nestedSheetArea.width).toBe(885);
    expect(nestedSheetArea.height).toBe(material.height);
    expect(nestedSheetArea.fullHeight).toBe(material.height);
    expect(nestedSheetArea.posX).toBe(905);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.remainingWidth).toBe(0);
    checkBorder(nestedSheetArea.border, 0, 5, 0, 0);
    nestedSheetArea.nestedSheetAreas.forEach(n => {
      expect(n.width).toEqual(nestedSheetArea.width);
      checkBorder(n.border, 0, 0, 5, 0);
    });
    const nestedNestedSheetAreas = nestedSheetArea.nestedSheetAreas;
    expect(nestedNestedSheetAreas[0].rects).toHaveLength(2);
    expect(nestedNestedSheetAreas[0].height).toBe(390);
    expect(nestedNestedSheetAreas[0].fullHeight).toBe(395);
    expect(nestedNestedSheetAreas[0].posX).toBe(0);
    expect(nestedNestedSheetAreas[0].posY).toBe(0);
    expect(nestedNestedSheetAreas[0].rects[0].width).toBe(440);
    checkBorder(nestedNestedSheetAreas[0].rects[0].border, 0, 5, 0, 0);
    checkBorder(nestedNestedSheetAreas[0].rects[1].border, 0, 0, 0, 0);
    expect(nestedNestedSheetAreas[1].rects).toHaveLength(1);
    expect(nestedNestedSheetAreas[1].height).toBe(100);
    expect(nestedNestedSheetAreas[1].fullHeight).toBe(105);
    expect(nestedNestedSheetAreas[1].posX).toBe(0);
    expect(nestedNestedSheetAreas[1].posY).toBe(395);
    expect(nestedNestedSheetAreas[1].rects[0].width).toBe(740);
    checkBorder(nestedNestedSheetAreas[1].rects[0].border, 0, 5, 0, 0);
    expect(nestedNestedSheetAreas[2].rects).toHaveLength(1);
    expect(nestedNestedSheetAreas[2].height).toBe(60);
    expect(nestedNestedSheetAreas[2].fullHeight).toBe(65);
    expect(nestedNestedSheetAreas[2].posX).toBe(0);
    expect(nestedNestedSheetAreas[2].posY).toBe(500);
    expect(nestedNestedSheetAreas[2].rects[0].width).toBe(700);
    checkBorder(nestedNestedSheetAreas[2].rects[0].border, 0, 5, 0, 0);
  });

  it('should pack three items', () => {
    const material = new Material(1, 'testMaterial', 2000, 600, 20);
    const items = [
      new Item('A', 900, 600, 1, 1),
      // new Item('B', 440, 390, 2, 1),
      // new Item('C', 700, 60, 2, 1),
      // new Item('D', 740, 100, 1, 1),
      // new Item('E', 100, 45, 24, 1),
      new Item('B', 1095, 50, 1, 1),
      new Item('C', 50, 545, 1, 1),
    ];

    const packer = new Packer();
    const packedSheets = packer.pack(items, [material]);
    expect(packedSheets).toHaveLength(1);

    const { sheetArea } = packedSheets[0];
    expect(sheetArea.rects).toHaveLength(1);
    expect(sheetArea.width).toBe(material.width);
    expect(sheetArea.height).toBe(material.height);
    expect(sheetArea.fullHeight).toBe(material.height);
    expect(sheetArea.posX).toBe(0);
    expect(sheetArea.posY).toBe(0);
    expect(sheetArea.remainingWidth).toBe(0);
    const { rects } = sheetArea;
    expect(rects[0].width).toBe(900);
    expect(rects[0].fullWidth).toBe(905);
    checkBorder(rects[0].border, 0, 5, 0, 0);
    expect(sheetArea.nestedSheetAreas).toHaveLength(1);
    const nestedSheetArea = sheetArea.nestedSheetAreas[0];
    expect(nestedSheetArea.nestedSheetAreas).toHaveLength(2);
    expect(nestedSheetArea.rects).toHaveLength(0);
    expect(nestedSheetArea.width).toBe(1095);
    expect(nestedSheetArea.height).toBe(material.height);
    expect(nestedSheetArea.fullHeight).toBe(material.height);
    expect(nestedSheetArea.posX).toBe(905);
    expect(nestedSheetArea.posY).toBe(0);
    expect(nestedSheetArea.remainingWidth).toBe(0);
    checkBorder(nestedSheetArea.border, 0, 5, 0, 0);
  });
});
*/
