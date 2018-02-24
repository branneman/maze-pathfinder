import 'babel-polyfill';
import { query } from './util/dom';
import Observer from './util/observer';

import Controls from './modules/controls';
import Maze from './modules/maze';

window.app = new class App {
  constructor() {
    this.controls = new Controls(query('.controls'));
    this.maze = new Maze(query('.maze'), this.controls.getSize());

    Observer.subscribe(this.controls, 'resize', size => this.maze.reset(size));
    Observer.subscribe(this.controls, 'solve', () => this.maze.solve());
    Observer.subscribe(this.controls, 'reset', () => window.location.reload());

    Observer.subscribe(this.maze, 'reset', () => this.controls.enableSolve());
    Observer.subscribe(this.maze, 'solved', () => this.controls.disableSolve());
  }
}();
