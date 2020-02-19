import moment from 'moment';

export default class Job {
  constructor() {
    this._clientName = 'Test client';
    this._dateRequired = moment();
    this._phone = '0123 / 1234567';
    this._sheets = [];
  }

  get clientName() {
    return this._clientName;
  }

  get dateRequired() {
    return this._dateRequired;
  }

  get dateRequiredStr() {
    return this._dateRequired ? this._dateRequired.format('DD.MM.YYYY') : '';
  }

  get numberOfCuts() {
    if (this._sheets.length) {
      return this._sheets.map(s => s.numberOfCuts).reduce((p, c) => p + c);
    }

    return 0;
  }

  get numberOfRects() {
    if (this._sheets.length) {
      return this._sheets.map(s => s.numberOfRects).reduce((p, c) => p + c);
    }

    return 0;
  }

  get phoneNumber() {
    return this._phone;
  }

  get sheets() {
    return this._sheets;
  }

  set sheets(sheets) {
    this._sheets = sheets;
  }

  get wastage() {
    let result = 0;
    if (this._sheets.length) {
      result = this._sheets.map(s => s.wastage).reduce((p, c) => p + c);
    }

    return Intl.NumberFormat('de', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
      result,
    );
  }
}
