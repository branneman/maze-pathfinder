import { query } from '../util/dom';
import Observer from '../util/observer';

class Controls {
  constructor(element) {
    this.element = element;
    this.sizeElement = query('#size', this.element);
    this.solveElement = query('.solve', this.element);
    this._addEventHandlers();
  }

  /**
   * @private
   */
  _addEventHandlers() {
    this.sizeElement.addEventListener('change', () => {
      const size = parseInt(this.sizeElement.value, 10);
      Observer.publish(this, 'resize', size);
    });

    this.solveElement.addEventListener('click', () => {
      Observer.publish(this, 'solve');
    });
  }
}

export default Controls;