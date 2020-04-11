export default class Sorter {
  static sort(rects) {
    const sorted = rects.sort(Sorter._comparator);
    return sorted;
  }

  static _comparator(r1, r2) {
    const area1 = r1.area;
    const area2 = r2.area;
    const areaDiff = area1 < area2 ? 100 - (area1 * 100) / area2 : 100 - (area2 * 100) / area1;

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

    // console.log(r1, r2, area2 - area1, areaDiff, result);
    return result;
  }
}
