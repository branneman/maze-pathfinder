import { query } from '../util/dom';
import Observer from '../util/observer';

class Controls {
  constructor(element) {
    this.element = element;
    this.sizeLabel = query('.size-label', this.element);
    this.solveElement = query('.controls__solve', this.element);
    this.resetElement = query('.controls__reset', this.element);
    this._addEventHandlers();
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
    this.solveElement.addEventListener('click', () =>
      Observer.publish(this, 'solve')
    );

    this.resetElement.addEventListener('click', () =>
      Observer.publish(this, 'reset')
    );
  }
}

export default Controls;
