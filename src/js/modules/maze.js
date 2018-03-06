import { makeGrid, findValue } from '../util/grid';
import { drawSquareGrid } from '../util/canvas';
import shortestPath from '../algorithm/dijkstra-shortestpath';
import Observer from '../util/observer';

const CANVAS_MARGIN = 1;
const CANVAS_GRID_COLOR = 'gainsboro';
const CANVAS_FONT = '14px monospaced';

class Maze {
  /**
   * @param {HTMLCanvasElement} element
   * @param {Number} size
   */
  constructor(element, size) {
    this.element = element;
    this.size = size;
    this.solved = false;

    this.reset();
    this._addEventHandlers();
  }

  /**
   * Find the shortest path through the maze
   */
  solve() {
    if (this.solved) return;

    // We can only proceed with start & end positions
    const start = findValue(this.maze, 'S');
    const end = findValue(this.maze, 'E');
    if (!start || !end) return;

    shortestPath(this.maze).forEach((pos, i, steps) =>
      this._drawPosition(this.element, pos, steps.length - i)
    );

    this.solved = true;
    Observer.publish(this, 'solved');
  }

  /**
   * Reset maze
   */
  reset() {
    this.solved = false;
    Observer.publish(this, 'reset');

    this.maze = makeGrid(this.size);
    this._drawGrid(this.element, this.size);
    this._drawMaze(this.maze);
  }

  /**
   * Return maze state as 2D array
   */
  getState() {
    return this.maze;
  }

  /**
   * Replace entire maze
   * @param {Array<Array<String>>} [newState]
   */
  update(newState) {
    // Empty update equals reset
    if (!newState || newState.length !== 20 || newState[0].length !== 20) {
      return;
    }

    this.maze = newState;
    this._drawGrid(this.element, this.size);
    this._drawMaze(this.maze);
    Observer.publish(this, 'updated', this.getState());
  }

  /**
   * @private
   */
  _addEventHandlers() {
    this.element.addEventListener('click', event => {
      this._onClick(event);
      Observer.publish(this, 'updated', this.getState());
    });
  }

  /**
   * @private
   * @param {Event.offsetX} Number - Pointer X coordinate relative to element
   * @param {Event.offsetY} Number - Pointer Y coordinate relative to element
   */
  _onClick({ offsetX, offsetY }) {
    // Maze can't be altered when already solved
    if (this.solved) return;

    this._updateSquare(
      this._getSquareByCoordinates(this.element, this.size, [offsetX, offsetY])
    );
  }

  /**
   * Draw maze contents
   * @private
   * @param {Array<Array<String>>} maze
   */
  _drawMaze(maze) {
    // Hardcoded start/end positions
    maze[0][0] = 'S';
    maze[maze.length - 1][maze.length - 1] = 'E';

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (['#', 'S', 'E'].indexOf(maze[y][x]) !== -1) {
          this._drawPosition(this.element, [x, y], maze[y][x]);
        }
      }
    }
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Number} size
   */
  _drawGrid(canvas, size) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = CANVAS_GRID_COLOR;
    drawSquareGrid(ctx, size, CANVAS_MARGIN);
  }

  /**
   * Place wall
   * @private
   * @param {Number} x
   * @param {Number} y
   */
  _updateSquare([x, y]) {
    this._setSquareByCoordinates(this.maze, this.size, this.element, [x, y]);
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Array<Number, Number>} square
   * @param {String} value
   */
  _drawPosition(canvas, square, value) {
    const ctx = canvas.getContext('2d');

    const { squareSize, posX, posY } = this._getSquareSize(
      canvas,
      this.size,
      square
    );

    ctx.font = CANVAS_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const oldColor = ctx.fillStyle;
    ctx.fillStyle = this._getValueColor(value);
    ctx.fillText(value, posX, posY);
    ctx.fillStyle = oldColor;
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Number} size
   * @param {Array<Number, Number>} square
   */
  _drawEmptySquare(canvas, size, square) {
    const ctx = canvas.getContext('2d');

    const { squareSize, posX, posY } = this._getSquareSize(
      canvas,
      size,
      square
    );
    const offset = squareSize / 2 - 1;

    const oldColor = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillRect(posX - offset, posY - offset, squareSize - 2, squareSize - 2);
    ctx.fillStyle = oldColor;
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Number} size
   * @param {Number} x
   * @param {Number} y
   */
  _getSquareByCoordinates(canvas, size, [x, y]) {
    const dimension = canvas.width / size;
    const squareX = Math.floor(x / dimension);
    const squareY = Math.floor(y / dimension);
    return [squareX, squareY];
  }

  /**
   * @private
   * @param {Array<Array<String>>} maze
   * @param {Number} size
   * @param {HTMLCanvasElement} canvas
   * @param {Number} x
   * @param {Number} y
   */
  _setSquareByCoordinates(maze, size, canvas, [x, y]) {
    if (maze[y][x] === '.') {
      maze[y][x] = '#';
      this._drawPosition(canvas, [x, y], '#');
    } else if (maze[y][x] === '#') {
      maze[y][x] = '.';
      this._drawEmptySquare(canvas, size, [x, y]);
    }
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Number} size
   * @param {Number} x
   * @param {Number} y
   */
  _getSquareSize(canvas, size, [x, y]) {
    const squareSize = Math.floor((canvas.width - CANVAS_MARGIN) / size);
    const modifier = CANVAS_MARGIN + squareSize / 2;
    const posX = squareSize * x + modifier;
    const posY = squareSize * y + modifier;

    return { squareSize, posX, posY };
  }

  /**
   * @private
   * @param {String} value
   */
  _getValueColor(value) {
    return (
      {
        S: 'steelblue',
        E: 'forestgreen',
        '#': 'saddlebrown'
      }[value] || 'crimson'
    );
  }
}

export default Maze;
