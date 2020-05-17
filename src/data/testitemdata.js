import { Item, Material } from '../bin-packing';

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
};

export const materials = [
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
];
