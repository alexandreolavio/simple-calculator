import View from './View';

export default class DisplayTimeView extends View {
  constructor(element) {
    super(element);
  }

  template(data) {
    return data;
  }
}
