import DisplayCalculatorView from '../views/DisplayCalculatorView';
import DisplayDateView from '../views/DisplayDateView';
import DisplayTimeView from '../views/DisplayTimeView';
import DateTimeHelper from '../helpers/DateTimeHelper';
import AudioModel from '../models/AudioModel';

const $ = document.querySelector.bind(document);
const $All = document.querySelectorAll.bind(document);

const _audio = new AudioModel('../../../sounds/click.mp3');
const _calcView = new DisplayCalculatorView($('#display'));
const _dataView = new DisplayDateView($('#data'));
const _timeView = new DisplayTimeView($('#hora'));

const _mapOperations = new Map()
  .set('soma', '+')
  .set('subtracao', '-')
  .set('divisao', '/')
  .set('multiplicacao', '*')
  .set('porcento', '%');

const _operators = new Set(_mapOperations.values());

class CalculatorController {
  constructor() {
    this._operation = [];
    this._lastOperator = '';
    this._lastNumber = '';
  }

  initialize() {
    this._scheduleDisplayDateTime();
    this._initButtonEvents();
    this._initKeyboardEvents();
    this._initAudioButtonEvent();
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
        this._execBtn(textBtn);
      });

      this._addEventListenerAll(btn, 'mouseover mouseup mousedown', () => {
        btn.style.cursor = 'pointer';
      });
    });
  }

  _addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => element.addEventListener(event.trim(), fn, false));
  }

  _initKeyboardEvents() {
    document.addEventListener('keyup', (e) => {
      _audio.play();

      switch (e.key) {
        case 'Escape':
          this._clearAll();
          break;
        case 'Backspace':
          this._clearEntry();
          break;
        case 'Enter':
        case '=':
          this._calculate();
          break;
        case '.':
        case ',':
          this._addDot();
          break;
        default:
          this._addOperation(_mapOperations.get(e.key) || e.key);
          break;
      }
    });
  }

  _initAudioButtonEvent() {
    $All('.btn-ac').forEach((btn) => {
      btn.addEventListener('dblclick', () => {
        _audio.enable = !_audio.enable;
      });
    });
  }

  _execBtn(value) {
    _audio.play();

    switch (value) {
      case 'ac':
        this._clearAll();
        break;
      case 'ce':
        this._clearEntry();
        break;
      case 'ponto':
        this._addDot();
        break;
      case 'igual':
        this._calculate();
        break;
      default:
        this._addOperation(_mapOperations.get(value) || value);
        break;
    }
  }

  _addOperation(value) {
    if (isNaN(this._lastOperation)) {
      if (this._isOperator(value)) {
        this._lastOperation = value;
      } else {
        this._pushOperation(parseInt(value, 10));
        this._updateDisplayCalcView();
      }
    } else if (this._isOperator(value)) {
      this._pushOperation(value);
    } else {
      this._lastOperation = `${this._lastOperation}${value}`;

      this._updateDisplayCalcView();
    }
  }

  _isOperator(value) {
    return _operators.has(value);
  }

  _pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) this._calculate();
  }

  _updateDisplayCalcView() {
    let lastItem = this._getLastItem(false);
    if (!lastItem) lastItem = 0;

    _calcView.update(lastItem);
  }

  _getLastItem(isOperator = true) {
    let lastItem;

    for (const op of this._operation.slice(0).reverse()) {
      if (this._isOperator(op) === isOperator) {
        lastItem = op;
        break;
      }
    }

    if (!lastItem) lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

    return lastItem;
  }

  _clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    this._updateDisplayCalcView();
  }

  _clearEntry() {
    this._operation.pop();
    this._updateDisplayCalcView();
  }

  _calculate() {
    let last = '';
    this._lastOperator = this._getLastItem();

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastNumber = this._getResult();
    } else if (this._operation.length === 3) {
      this._lastNumber = this._getLastItem(false);
    } else {
      const firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    let result = this._getResult();
    this._operation = [(last === '%') ? result /= 100 : result];

    if (last) this._operation.push(last);

    this._updateDisplayCalcView();
  }

  _getResult() {
    try {
      return eval(this._operation.join(''));
    } catch (error) {
      setTimeout(() => {
        _calcView.update('Error');
      }, 1);
    }
    return 0;
  }

  _addDot() {
    if (typeof this._lastOperation === 'string' && this._lastOperation.split('').indexOf('.')) return;
    if (this._isOperator(this._lastOperation) || !this._lastOperation) this._pushOperation('0.');
    else this._lastOperation = `${this._lastOperation}.`;

    this._updateDisplayCalcView();
  }

  get _lastOperation() {
    return this._operation[this._operation.length - 1];
  }

  set _lastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }
}

const instance = new CalculatorController();
const initialize = instance.initialize.bind(instance);

export default initialize;
