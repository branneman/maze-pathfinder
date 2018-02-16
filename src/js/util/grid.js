const fill = (value, len) => Array.from({ length: len }, () => value);

const matrix2d = (x, y, value) => fill(value, y).map(() => fill(value, x));

const makeGrid = size => {
  const maze = matrix2d(size, size, '.');
  maze[0] = fill('#', size);
  maze[maze.length - 1] = fill('#', size);
  maze.forEach((line, y) => {
    maze[y][0] = '#';
    maze[y][maze[y].length - 1] = '#';
  });
  return maze;
};

const findValue = (grid, value) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === value) return [x, y];
    }
  }
};

export { fill, matrix2d, makeGrid, findValue };
