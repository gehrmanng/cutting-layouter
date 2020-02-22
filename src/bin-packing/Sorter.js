export default class Sorter {
  static sort(rects) {
    return rects.sort(Sorter._comparator);
  }

  static _comparator(r1, r2) {
    const area1 = r1.area;
    const area2 = r2.area;
    const areaDiff = 100 - (area1 * 100) / area2;

    let result = area2 - area1;

    if (result === 0 || areaDiff <= 50) {
      result = r2.width - r1.width;
    }

    if (result === 0) {
      result = r2.height - r1.height;
    }

    if (result === 0) {
      result = r1.index - r2.index;
    }

    return result;
  }
}
