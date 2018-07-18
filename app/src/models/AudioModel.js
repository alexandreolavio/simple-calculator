
export default class AudioModel {
  constructor(sound) {
    this._audio = new Audio(sound);
    this._enable = false;
  }

  play() {
    if (this._enable) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  get enable() {
    return this._enable;
  }

  set enable(value) {
    this._enable = value;
  }
}
