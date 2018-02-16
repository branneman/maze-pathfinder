import { makeGrid, findValue } from '../util/grid';
import { drawSquareGrid } from '../util/canvas';
import shortestPath from '../algorithm/dijkstra-shortestpath';

const CANVAS_MARGIN = 1;
const CANVAS_GRID_COLOR = 'gainsboro';
const CANVAS_FONT = '36px monospaced';

class Maze {
  constructor(element) {
    this.element = element;
    this.resize(10);
    this._addEventHandlers();
  }

  /**
   * Find the shortest path through the maze
   */
  solve() {
    // We can only proceed with start & end positions
    const start = findValue(this.maze, 'S');
    const end = findValue(this.maze, 'E');
    if (!start || !end) return;

    shortestPath(this.maze).forEach(pos =>
      this._drawPosition(this.element, pos, 'O')
    );
  }

  /**
   * Set new square size and reset maze
   * @param {Number} size
   */
  resize(size) {
    this.size = size;
    this._reset(size);
    this._drawMaze(this.maze);
  }

  /**
   * @private
   */
  _addEventHandlers() {
    this.element.addEventListener('click', event => {
      const [x, y] = this._getSquareByCoordinates(
        this.element,
        this.size,
        event.offsetX,
        event.offsetY
      );
      if (this.maze[y][x] === '.') {
        this.maze[y][x] = '#';
        this._drawPosition(this.element, [x, y], '#');
      }
    });
  }

  /**
   * Reset maze to new square size
   * @private
   * @param {Number} size
   */
  _reset(size) {
    this.maze = makeGrid(size);
    this._drawGrid(this.element, size);
  }

  /**
   * Draw maze contents
   * @private
   * @param {Array<Array<String>>} maze
   */
  _drawMaze(maze) {
    // Hardcoded start/end positions
    maze[1][1] = 'S';
    maze[maze.length - 2][maze.length - 2] = 'E';

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
    ctx.strokeStyle = CANVAS_GRID_COLOR;
    drawSquareGrid(ctx, size, CANVAS_MARGIN);
  }

  /**
   * @private
   * @param {HTMLCanvasElement} canvas
   * @param {Array<Number, Number>} x y
   * @param {String} value
   */
  _drawPosition(canvas, [x, y], value) {
    const ctx = canvas.getContext('2d');

    const squareSize = Math.floor((canvas.width - CANVAS_MARGIN) / this.size);
    const modifier = CANVAS_MARGIN + squareSize / 2;
    const posX = squareSize * x + modifier;
    const posY = squareSize * y + modifier;

    ctx.font = CANVAS_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const oldColor = ctx.fillStyle;
    ctx.fillStyle = this._getValueColor(value);
    ctx.fillText(value, posX, posY);
    ctx.fillStyle = oldColor;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Number} x
   * @param {Number} y
   */
  _getSquareByCoordinates(canvas, size, x, y) {
    const dimension = canvas.width / size;
    const squareX = Math.floor(x / dimension);
    const squareY = Math.floor(y / dimension);
    return [squareX, squareY];
  }

  /**
   * @private
   * @param {String} value
   */
  _getValueColor(value) {
    return (
      {
        O: 'crimson',
        S: 'steelblue',
        E: 'forestgreen',
        '#': 'saddlebrown'
      }[value] || 'black'
    );
  }
}

export default Maze;
