import DisplayDateView from '../views/DisplayDateView';
import DisplayTimeView from '../views/DisplayTimeView';
import DateTimeHelper from '../helpers/DateTimeHelper';

const $ = document.querySelector.bind(document);

const _dataView = new DisplayDateView($('#data'));
const _timeView = new DisplayTimeView($('#hora'));

export default class CalculatorController {
  constructor() {
    this._setDisplayDateTime();
  }

  _setDisplayDateTime() {
    _dataView.update(DateTimeHelper.currentDateFormat());
    _timeView.update(DateTimeHelper.currentTimeFormat());
  }
}
