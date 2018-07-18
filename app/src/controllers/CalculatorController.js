import DisplayDateView from '../views/DisplayDateView';

const $ = document.querySelector.bind(document);

const _dataView = new DisplayDateView($('#data'));

export default class CalculatorController {
  constructor() {
    _dataView.update(new Date().toLocaleDateString());
  }
}
