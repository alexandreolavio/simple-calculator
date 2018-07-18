export default class View {
  constructor(el) {
    this._el = el;
  }

  template() {
    throw new Error('the View class needs to be overloaded');
  }

  update(data) {
    this._el.innerHTML = this.template(data);
  }

  get value() {
    return this._el.innerHTML;
  }
}
