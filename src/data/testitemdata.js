/* eslint-disable no-restricted-syntax */
import { Item, Material, Rect, SheetArea } from '../bin-packing';

export const bladeWidth = 5;

export const testItems = {
  gt1: [
    new Item('A', 100, 100, 1, 9001),
    new Item('B', 200, 100, 1, 9001),
    new Item('C', 300, 100, 1, 9001),
  ],
  gt2: [
    new Item('A', 100, 100, 1, 9002),
    new Item('B', 200, 100, 1, 9002),
    new Item('C', 300, 100, 1, 9002),
  ],
  gt3: [
    new Item('A', 100, 100, 1, 9003),
    new Item('B', 200, 100, 1, 9003),
    new Item('C', 300, 100, 1, 9003),
  ],
  gt4: [
    new Item('A', 100, 100, 1, 9004),
    new Item('B', 200, 100, 1, 9004),
    new Item('C', 300, 100, 1, 9004),
  ],
  gt5: [
    new Item('A', 100, 100, 1, 9004),
    new Item('B', 200, 100, 1, 9004),
    new Item('C', 300, 100, 1, 9004),
    new Item('D', 300, 95, 1, 9004),
    new Item('E', 200, 95, 1, 9004),
    new Item('F', 100, 95, 1, 9004),
  ],
  gt6: [
    new Item('A', 100, 100, 1, 9005),
    new Item('B', 200, 100, 1, 9005),
    new Item('C', 300, 100, 1, 9005),
    new Item('D', 300, 95, 1, 9005),
    new Item('E', 200, 95, 1, 9005),
    new Item('F', 100, 95, 1, 9005),
  ],
  gt7: [
    new Item('A', 100, 100, 1, 9006),
    new Item('B', 200, 100, 1, 9006),
    new Item('C', 300, 100, 1, 9006),
  ],
  gt8: [new Item('A', 200, 400, 1, 9007), new Item('B', 50, 350, 1, 9007)],
  gt9: [
    new Item('A', 200, 400, 1, 9007),
    new Item('B', 50, 350, 1, 9007),
    new Item('C', 80, 350, 1, 9007),
  ],
  gt10: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 440, 390, 2, 9005),
    new Item('C', 700, 60, 2, 9005),
    new Item('D', 740, 100, 1, 9005),
  ],
  gt11: [new Item('A', 1000, 50, 1, 9008), new Item('B', 50, 535, 1, 9008)],
  gt12: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 1095, 50, 1, 9005),
    new Item('C', 50, 535, 1, 9005),
  ],
  gt13: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 1095, 50, 2, 9005),
    new Item('C', 50, 480, 1, 9005),
  ],
  gt14: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 595, 50, 1, 9005),
    new Item('C', 395, 50, 1, 9005),
    new Item('D', 95, 50, 1, 9005),
    new Item('E', 1095, 50, 1, 9005),
    new Item('F', 50, 480, 1, 9005),
  ],
  gt15: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 1095, 50, 1, 9005),
    new Item('C', 50, 535, 1, 9005),
    new Item('D', 100, 50, 1, 9005),
  ],
  gt16: [new Item('A', 845, 620, 4, 9009)],
  gt17: [
    new Item('A', 620, 200, 4, 9009),
    new Item('B', 620, 100, 4, 9009),
    new Item('C', 845, 620, 4, 9009),
  ],
  gt18: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 440, 390, 2, 9005),
    new Item('D', 740, 30, 2, 9005),
    new Item('C', 700, 60, 2, 9005),
  ],
  gt19: [
    new Item('A', 740, 30, 1, 9010),
    new Item('B', 700, 60, 2, 9010),
    new Item('C', 368, 30, 1, 9010),
    new Item('D', 367, 30, 1, 9010),
  ],
  gt20: [
    new Item('A', 740, 30, 1, 9010),
    new Item('B', 700, 60, 2, 9010),
    new Item('C', 367, 30, 2, 9010),
  ],
  gt21: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 440, 390, 2, 9005),
    new Item('D', 740, 30, 1, 9005),
    new Item('C', 700, 60, 2, 9005),
    new Item('E', 367, 30, 2, 9005),
  ],
  gt22: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 440, 390, 2, 9005),
    new Item('D', 740, 30, 2, 9005),
    new Item('C', 700, 60, 2, 9005),
    new Item('E', 100, 50, 20, 9005),
  ],
  gt23: [
    new Item('A', 900, 600, 1, 9005),
    new Item('B', 440, 390, 2, 9005),
    new Item('D', 740, 30, 2, 9005),
    new Item('C', 700, 60, 2, 9005),
    new Item('E', 100, 50, 25, 9005),
  ],
  gt24: [
    new Item('A', 440, 390, 2, 9005),
    new Item('B', 500, 30, 2, 9005),
    new Item('C', 500, 60, 2, 9005),
    new Item('D', 100, 50, 20, 9005),
  ],
  gt25: [
    new Item('A', 440, 390, 2, 9005),
    new Item('B', 500, 30, 2, 9005),
    new Item('C', 500, 60, 2, 9005),
    new Item('D', 100, 50, 21, 9005),
  ],
};

export const materials = [
  new Material(1, 'OSB', 2500, 1250, 12),
  new Material(2, 'OSB', 2500, 1250, 15),
  new Material(3, 'Sperrholz Birke', 2500, 1250, 12, true),
  new Material(4, 'Sperrholz Birke', 2500, 1250, 15, true),
  new Material(5, 'MDF', 800, 600, 9),
  new Material(6, 'MDF', 1200, 600, 12),
  new Material(7, 'MDF', 2500, 1250, 15),
  new Material(8, 'Leimholz Eiche', 2000, 600, 20, true),
  new Material(9, 'TestMaterial', 885, 600, 10),
  new Material(10, 'Remove Test Material', 600, 200, 10),
  new Material(11, 'OSB Verlegeplatte', 2040, 665, 12, true),
  new Material(12, 'OSB Verlegeplatte', 2040, 665, 15, true),
  new Material(9001, 'TM1', 610, 100, 12),
  new Material(9002, 'TM2', 700, 100, 12),
  new Material(9003, 'TM3', 613, 100, 12),
  new Material(9004, 'TM4', 610, 200, 12),
  new Material(9005, 'TM5', 2000, 600, 12),
  new Material(9006, 'TM6', 700, 200, 12),
  new Material(9007, 'TM7', 700, 400, 12),
  new Material(9008, 'TM8', 1000, 600, 12),
  new Material(9009, 'TM9', 2500, 1250, 12),
  new Material(9010, 'TM10', 740, 205, 12),
  new Material(9100, 'TM100', 100, 100, 12),
];

export const getRects = (items) => {
  const rects = [];
  for (const item of items) {
    for (let i = 0; i < item.quantity; i += 1) {
      rects.push(new Rect(item.id, item.width, item.height, 0, 0, item.name, i));
    }
  }
  return rects;
};

export const getSheetArea = (itemData) => {
  const material = materials.filter((m) => m.id === itemData[0].material).pop();
  return new SheetArea(material.width, material.height, material.height, bladeWidth, undefined, 0);
};
