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
    this._initPastFromClipboardEvent();
    this._copyToClipboard();
  }

  execBtn(value) {
    _audio.play();

    this.execEvent(value);
  }

  execEvent(value, ctrlKey) {
    switch (value) {
      case 'Escape':
      case 'ac':
        this._clearAll();
        break;
      case 'Backspace':
      case 'ce':
        this._clearEntry();
        break;
      case '.':
      case ',':
      case 'ponto':
        this._addDot();
        break;
      case 'Enter':
      case '=':
      case 'igual':
        this._calculate();
        break;
      case 'c':
        if (ctrlKey) this._copyToClipboard();
        break;
      default: {
        const op = _mapOperations.get(value);
        const isNum = !isNaN(value);
        if (op || isNum || _operators.has(value)) this._addOperation(op || value);
      }
    }
  }

  _initKeyboardEvents() {
    document.addEventListener('keyup', (e) => {
      _audio.play();
      this.execEvent(e.key, e.ctrlKey);
    });
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
        this.execBtn(textBtn);
      });

      this._addEventListenerAll(btn, 'mouseover mouseup mousedown', () => {
        btn.style.cursor = 'pointer';
      });
    });
  }

  _addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => element.addEventListener(event.trim(), fn, false));
  }

  _initAudioButtonEvent() {
    $All('.btn-ac').forEach((btn) => {
      btn.addEventListener('dblclick', () => {
        _audio.enable = !_audio.enable;
      });
    });
  }

  _initPastFromClipboardEvent() {
    document.addEventListener('paste', (e) => {
      const text = e.clipboardData.getData('Text');
      _calcView.update(parseFloat(text.trim()));
    });
  }

  _copyToClipboard() {
    const input = document.createElement('input');
    input.value = _calcView.value;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    input.remove();
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
