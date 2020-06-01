import { Item } from '../bin-packing';

export default {
  s1: [
    new Item('A', 870, 650, 2, 11),
    new Item('B', 200, 620, 1, 11),
    new Item('A', 60, 620, 1, 11),
  ],
  s2: [
    new Item('A', 845, 620, 2, 11),
    new Item('B', 200, 620, 1, 11),
    new Item('C', 60, 620, 2, 11),
  ],
  s3: [
    new Item('A', 845, 620, 1, 11),
    new Item('B', 866, 92, 1, 11),
    new Item('C', 866, 258, 2, 11),
    new Item('D', 200, 620, 1, 11),
    new Item('E', 100, 620, 1, 11),
  ],
  s4: [
    new Item('A', 845, 620, 2, 11),
    new Item('B', 200, 620, 1, 11),
    new Item('C', 100, 620, 1, 11),
  ],
  s5: [new Item('A', 845, 620, 2, 11), new Item('B', 100, 620, 3, 11)],
  s6: [
    // fail
    new Item('A', 845, 620, 1, 11),
    new Item('B', 870, 50, 2, 11),
    new Item('C', 866, 144, 3, 11),
    new Item('D', 100, 620, 3, 11),
    new Item('E', 821, 60, 1, 11),
  ],
  s7: [
    // fail
    new Item('A', 60, 620, 1, 11),
    new Item('B', 821, 100, 2, 11),
    new Item('C', 821, 200, 2, 11),
    new Item('D', 870, 50, 2, 11),
    new Item('E', 821, 60, 1, 11),
    new Item('F', 866, 144, 3, 11),
    new Item('G', 100, 620, 1, 11),
  ],
  s8: [
    new Item('A', 821, 200, 2, 11),
    new Item('B', 821, 60, 2, 11),
    new Item('C', 821, 100, 7, 11),
  ],
  s9: [new Item('A', 821, 100, 3, 11), new Item('B', 866, 92, 1, 11)],
  s10: [new Item('A', 900, 650, 2, 12)],
  s11: [new Item('A', 870, 100, 4, 12)],
};
