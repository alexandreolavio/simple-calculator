import DisplayDateView from '../views/DisplayDateView';
import DisplayTimeView from '../views/DisplayTimeView';
import DateTimeHelper from '../helpers/DateTimeHelper';
import AudioModel from '../models/AudioModel';

const _audio = new AudioModel('../sounds/click.mp3');
const $ = document.querySelector.bind(document);
const $All = document.querySelectorAll.bind(document);

const _dataView = new DisplayDateView($('#data'));
const _timeView = new DisplayTimeView($('#hora'));

export default class CalculatorController {

  initialize() {
    this._scheduleDisplayDateTime();
    this._initButtonEvents();
    this._initKeyboardEvents();
    this._initAudioButtonEvent();
  }

  _execBtn(value) {
    _audio.play();

    switch (value) {
      case 'ac':
        break;
      case 'ce':
        break;
      case 'ponto':
        break;
      case 'igual':
        break;
      default:
        break;
    }
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
          break;
        case 'Backspace':
          break;
        case 'Enter':
        case '=':
          break;
        case '.':
        case ',':
          break;
        default:
          break;
      }
    });
  }

  _initAudioButtonEvent() {
    $All('.btn-ac').forEach((btn) => {
      btn.addEventListener('dblclick', () => {
        _audio.enable = !_audio.enable;

        console.log(_audio.enable);
      });
    });
  }
}

const instance = new CalculatorController();
const initialize = instance.initialize.bind(instance);

export { initialize };
