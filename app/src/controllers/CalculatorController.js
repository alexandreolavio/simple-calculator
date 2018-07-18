import DisplayDateView from '../views/DisplayDateView';
import DisplayTimeView from '../views/DisplayTimeView';

const $ = document.querySelector.bind(document);

const _dataView = new DisplayDateView($('#data'));
const _timeView = new DisplayTimeView($('#hora'));

export default class CalculatorController {
  constructor() {
    _dataView.update(new Date().toLocaleDateString());
    _timeView.update(new Date().toLocaleTimeString());
  }
}
