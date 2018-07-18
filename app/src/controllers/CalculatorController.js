import DisplayDateView from '../views/DisplayDateView';
import DisplayTimeView from '../views/DisplayTimeView';
import DateTimeHelper from '../helpers/DateTimeHelper';

const $ = document.querySelector.bind(document);
const $All = document.querySelectorAll.bind(document);

const _dataView = new DisplayDateView($('#data'));
const _timeView = new DisplayTimeView($('#hora'));

export default class CalculatorController {

  initialize() {
    this._scheduleDisplayDateTime();
    this._initButtonEvents();
  }

  _scheduleDisplayDateTime() {
    this._setDisplayDateTime();

    setInterval(() => {
      this._setDisplayDateTime();
    }, 1000);
  }

  _setDisplayDateTime() {
    _dataView.update(DateTimeHelper.currentDateFormat());
    _timeView.update(DateTimeHelper.currentTimeFormat());
  }

  _initButtonEvents() {
    const buttons = $All('#buttons > g, #parts > g');

    buttons.forEach((btn) => {
      this._addEventListenerAll(btn, 'click drag', () => {
        const textBtn = btn.className.baseVal.replace('btn-', '');
        console.log(textBtn);
      });

      this._addEventListenerAll(btn, 'mouseover mouseup mousedown', () => {
        btn.style.cursor = 'pointer';
      });
    });
  }

  _addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => element.addEventListener(event.trim(), fn, false));
  }
}

const instance = new CalculatorController();
const initialize = instance.initialize.bind(instance);

export { initialize };
