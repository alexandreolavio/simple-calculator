import View from './View';

export default class DisplayCalculatorView extends View {
  constructor(element) {
    super(element);
  }

  template(data) {
    if (data.toString().length > 10) data = 'NPC';

    return data;
  }
}
