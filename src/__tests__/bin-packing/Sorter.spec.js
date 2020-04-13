import { Sorter, Rect } from '../../bin-packing';

const checkSortResult = (actual, expectedOrder) => {
  expectedOrder.forEach((expected, index) => {
    expect(`${actual[index].name}${actual[index].index}`).toBe(expected);
  });
};

describe('Sorter', () => {
  it('should sort three rects in descending order', () => {
    const rects = [
      Rect.create('A', 100, 100),
      Rect.create('B', 200, 100),
      Rect.create('C', 300, 100),
    ];

    checkSortResult(Sorter.sort(rects), ['C0', 'B0', 'A0']);
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

    checkSortResult(Sorter.sort(rects), ['C0', 'D0', 'B0', 'E0', 'A0', 'F0']);
  });

  it('should sort', () => {
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 440, 390, 0),
      Rect.create('B', 440, 390, 1),
      Rect.create('C', 700, 60, 0),
      Rect.create('C', 700, 60, 1),
      Rect.create('D', 740, 100),
    ];

    checkSortResult(Sorter.sort(rects), ['A0', 'B0', 'B1', 'D0', 'C0', 'C1']);
  });

  it('should sort 2', () => {
    const rects = [
      Rect.create('A', 900, 600),
      Rect.create('B', 440, 390, 0),
      Rect.create('B', 440, 390, 1),
      Rect.create('C', 700, 60, 0),
      Rect.create('C', 700, 60, 1),
      Rect.create('D', 740, 30, 0),
      Rect.create('D', 740, 30, 1),
    ];

    checkSortResult(Sorter.sort(rects), ['A0', 'B0', 'B1', 'D0', 'D1', 'C0', 'C1']);
  });

  it('should sort correct', () => {
    const rects = [Rect.create('A', 700, 60), Rect.create('B', 740, 30)];

    checkSortResult(Sorter.sort(rects), ['B0', 'A0']);
  });

  it('should sort 3', () => {
    const rects = [
      Rect.create('A', 620, 200, 0),
      Rect.create('A', 620, 200, 1),
      Rect.create('A', 620, 200, 2),
      Rect.create('A', 620, 200, 3),
      Rect.create('B', 620, 100, 0),
      Rect.create('B', 620, 100, 1),
      Rect.create('B', 620, 100, 2),
      Rect.create('B', 620, 100, 3),
      Rect.create('C', 845, 620, 0),
      Rect.create('C', 845, 620, 1),
      Rect.create('C', 845, 620, 2),
      Rect.create('C', 845, 620, 3),
    ];

    checkSortResult(Sorter.sort(rects), [
      'C0',
      'C1',
      'C2',
      'C3',
      'A0',
      'A1',
      'A2',
      'A3',
      'B0',
      'B1',
      'B2',
      'B3',
    ]);
  });

  it('should sort 5', () => {
    const rects = [
      Rect.create('A', 740, 30),
      Rect.create('B', 700, 60, 0),
      Rect.create('B', 700, 60, 1),
      Rect.create('C', 368, 30),
      Rect.create('D', 367, 30),
    ];

    checkSortResult(Sorter.sort(rects), ['A0', 'B0', 'B1', 'C0', 'D0']);
  });

  it('should sort by index', () => {
    const rects = [
      Rect.create('A', 100, 50, 0),
      Rect.create('A', 100, 50, 1),
      Rect.create('A', 100, 50, 2),
      Rect.create('A', 100, 50, 3),
      Rect.create('A', 100, 50, 4),
      Rect.create('A', 100, 50, 5),
      Rect.create('A', 100, 50, 6),
      Rect.create('A', 100, 50, 7),
      Rect.create('A', 100, 50, 8),
      Rect.create('A', 100, 50, 9),
      Rect.create('A', 100, 50, 10),
      Rect.create('A', 100, 50, 11),
      Rect.create('A', 100, 50, 12),
      Rect.create('A', 100, 50, 13),
      Rect.create('A', 100, 50, 14),
      Rect.create('A', 100, 50, 15),
      Rect.create('A', 100, 50, 16),
      Rect.create('A', 100, 50, 17),
      Rect.create('A', 100, 50, 18),
      Rect.create('A', 100, 50, 19),
      Rect.create('A', 100, 50, 20),
      Rect.create('A', 100, 50, 21),
      Rect.create('A', 100, 50, 22),
    ];

    checkSortResult(Sorter.sort(rects), [
      'A0',
      'A1',
      'A2',
      'A3',
      'A4',
      'A5',
      'A6',
      'A7',
      'A8',
      'A9',
      'A10',
      'A11',
      'A12',
      'A13',
      'A14',
      'A15',
      'A16',
      'A17',
      'A18',
      'A19',
      'A20',
      'A21',
      'A22',
    ]);
  });
});
