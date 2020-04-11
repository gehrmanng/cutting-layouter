import { Sorter, Rect } from '../../bin-packing';

const checkSortResult = (actual, expectedOrder) => {
  expectedOrder.forEach((expected, index) => {
    expect(actual[index].name).toBe(expected);
  });
};

describe('Sorter', () => {
  it('should sort three rects in descending order', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    checkSortResult(Sorter.sort(rects), ['C', 'B', 'A']);
  });

  it('should sort six items and keep same heights together', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
      Rect.create('D', 300, 95),
      Rect.create('E', 200, 95),
      Rect.create('F', 100, 95),
    ];

    checkSortResult(Sorter.sort(rects), ['C', 'D', 'B', 'E', 'A', 'F']);
  });

  it('should sort', () => {
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B1', 440, 390),
      Rect.create('B2', 440, 390),
      Rect.create('C1', 700, 60),
      Rect.create('C2', 700, 60),
      Rect.create('D', 740, 100),
    ];

    checkSortResult(Sorter.sort(rects), ['A', 'B1', 'B2', 'D', 'C1', 'C2']);
  });

  it('should sort 2', () => {
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B1', 440, 390),
      Rect.create('B2', 440, 390),
      Rect.create('C1', 700, 60),
      Rect.create('C2', 700, 60),
      Rect.create('D1', 740, 30),
      Rect.create('D2', 740, 30),
    ];

    checkSortResult(Sorter.sort(rects), ['A', 'B1', 'B2', 'D1', 'D2', 'C1', 'C2']);
  });

  it('should sort correct', () => {
    const rects = [Rect.create('A', 700, 60), Rect.create('B', 740, 30)];

    checkSortResult(Sorter.sort(rects), ['B', 'A']);
  });

  it('should sort 3', () => {
    const rects = [
      Rect.create('A1', 620, 200),
      Rect.create('A2', 620, 200),
      Rect.create('A3', 620, 200),
      Rect.create('A4', 620, 200),
      Rect.create('B1', 620, 100),
      Rect.create('B2', 620, 100),
      Rect.create('B3', 620, 100),
      Rect.create('B4', 620, 100),
      Rect.create('C1', 845, 620),
      Rect.create('C2', 845, 620),
      Rect.create('C3', 845, 620),
      Rect.create('C4', 845, 620),
    ];

    checkSortResult(Sorter.sort(rects), [
      'C1',
      'C2',
      'C3',
      'C4',
      'A1',
      'A2',
      'A3',
      'A4',
      'B1',
      'B2',
      'B3',
      'B4',
    ]);
  });

  it('should sort 5', () => {
    const rects = [
      Rect.create('A', 740, 30),
      Rect.create('B1', 700, 60),
      Rect.create('B2', 700, 60),
      Rect.create('C', 368, 30),
      Rect.create('D', 367, 30),
    ];

    checkSortResult(Sorter.sort(rects), ['A', 'B1', 'B2', 'C', 'D']);
  });
});
