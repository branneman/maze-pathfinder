import 'babel-polyfill';
import { query } from './util/dom';
import Observer from './util/observer';

import Controls from './modules/controls';
import Maze from './modules/maze';

new class App {
  constructor() {
    this.controls = new Controls(query('.controls'));
    this.maze = new Maze(query('.maze'));

    // Observer.subscribe(this.controls, 'resize', size => this.maze.resize(size));
    Observer.subscribe(this.controls, 'solve', () => this.maze.solve());
  }
}();
