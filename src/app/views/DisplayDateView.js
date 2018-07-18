import View from './View';

export default class DisplayDateView extends View {
  constructor(element) {
    super(element);
  }

  template(data) {
    return data;
  }
}
