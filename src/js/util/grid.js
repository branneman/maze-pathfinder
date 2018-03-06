const fill = (value, len) => Array.from({ length: len }, () => value);

const matrix2d = (x, y, value) => fill(value, y).map(() => fill(value, x));

const makeGrid = size => matrix2d(size, size, '.');

const findValue = (grid, value) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === value) return [x, y];
    }
  }
};

export { fill, matrix2d, makeGrid, findValue };
