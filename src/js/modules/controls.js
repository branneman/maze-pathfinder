import { query } from '../util/dom';
import Observer from '../util/observer';

class Controls {
  constructor(element) {
    this.element = element;
    this.sizeElement = query('#size', this.element);
    this.sizeLabel = query('.size-label', this.element);
    this.solveElement = query('.controls__solve', this.element);
    this.resetElement = query('.controls__reset', this.element);
    this._addEventHandlers();
  }

  getSize() {
    return parseInt(this.sizeElement.value, 10);
  }

  enableSolve() {
    this.solveElement.removeAttribute('disabled');
  }

  disableSolve() {
    this.solveElement.setAttribute('disabled', 'disabled');
  }

  /**
   * @private
   */
  _addEventHandlers() {
    this.sizeElement.addEventListener('change', () => {
      const size = this.getSize();
      this.sizeLabel.innerHTML = size;
      Observer.publish(this, 'resize', size);
    });

    this.solveElement.addEventListener('click', () =>
      Observer.publish(this, 'solve')
    );

    this.resetElement.addEventListener('click', () =>
      Observer.publish(this, 'reset')
    );
  }
}

export default Controls;
