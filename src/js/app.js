import 'babel-polyfill';
import { query } from './util/dom';
import Observer from './util/observer';
import serializer from './util/serializer';

import Controls from './modules/controls';
import Maze from './modules/maze';
import StateManager from './modules/statemanager';

/**
 * App bootstrap controller
 *  implements Mediator pattern
 */
window.app = new class App {
  constructor() {
    this.controls = new Controls(query('.controls'));
    this.maze = new Maze(query('.maze'), 20);
    this.stateManager = new StateManager(serializer, this.maze.getState());

    this._addEventHandlers();
  }

  _addEventHandlers() {
    // Controls
    Observer.subscribe(this.controls, 'solve', () => this.maze.solve());
    Observer.subscribe(this.controls, 'reset', () => this.maze.reset());

    // Maze
    Observer.subscribe(this.maze, 'updated', newState =>
      this.stateManager.update(newState)
    );
    Observer.subscribe(this.maze, 'reset', () => {
      this.controls.enableSolve();
      this.stateManager.update();
    });
    Observer.subscribe(this.maze, 'solved', () => this.controls.disableSolve());

    // State Manager
    Observer.subscribe(this.stateManager, 'updated', newState =>
      this.maze.update(newState)
    );
  }
}();
