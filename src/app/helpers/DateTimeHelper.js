export default class DateTimeHelper {
  constructor() {
    throw new Error('The DateTimeHelper class can not be instantiated.');
  }

  static get currentDate() {
    return new Date();
  }

  static currentDateFormat(params = {}) {
    const { locale = 'pt-BR', day = '2-digit', month = 'long', year = 'numeric' } = params;
    return this.currentDate.toLocaleDateString(locale, { day, month, year });
  }

  static currentTimeFormat(locale = 'pt-BR') {
    return this.currentDate.toLocaleTimeString(locale);
  }
}
