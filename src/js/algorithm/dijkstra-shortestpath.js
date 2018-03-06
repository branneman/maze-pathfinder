import { fill, matrix2d, findValue } from '../util/grid';

const recursionLimit = 1000;

const isOutOfBounds = ([x, y], maxX, maxY) =>
  x < 0 || y < 0 || x >= maxX || y >= maxY;

const isWall = (grid, [x, y]) => grid[y][x] === '#';

const getSquare = (grid, [x, y]) => grid[y][x];

const setSquare = (grid, [x, y], value) => (grid[y][x] = value);

const getGridDimensions = grid => ({ maxX: grid[0].length, maxY: grid.length });

const isValidSquare = grid => square => {
  const { maxX, maxY } = getGridDimensions(grid);
  if (isOutOfBounds(square, maxX, maxY)) return false;
  return !isWall(grid, square);
};

const haveVisitedSquare = (grid, value) => ([x, y]) => {
  const isAlreadySet = typeof grid[y][x] === 'number';
  const isHigherNumber = grid[y][x] > value;
  return !isAlreadySet || isHigherNumber;
};

const getAdjacentSquares = ([x, y]) => [
  [x, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x, y + 1]
];

const markSquareDistances = (maze, distances, iteration, currentSquare) => {
  iteration++;
  if (iteration >= recursionLimit) throw 'too much recursion';

  getAdjacentSquares(currentSquare)
    .filter(isValidSquare(maze))
    .filter(haveVisitedSquare(distances, iteration))
    .forEach(square => {
      setSquare(distances, square, iteration);
      markSquareDistances(maze, distances, iteration, square);
    });
};

const getNextStep = (maze, distances, square) => {
  const squares = getAdjacentSquares(square).filter(isValidSquare(maze));
  const incremental = (a, b) =>
    getSquare(distances, a) - getSquare(distances, b);
  squares.sort(incremental);
  return squares.length ? squares[0] : false;
};

const getSteps = (maze, distances, currentSquare) => {
  const steps = [];
  let iteration = 0;
  while (++iteration) {
    if (iteration >= recursionLimit) {
      throw 'too much recursion';
    }

    currentSquare = getNextStep(maze, distances, currentSquare);
    if (!currentSquare || getSquare(maze, currentSquare) === 'S') {
      break;
    }
    steps.push(currentSquare);
  }
  return steps;
};

const dijkstraShortestPath = maze => {
  const start = findValue(maze, 'S');
  const end = findValue(maze, 'E');
  const { maxX, maxY } = getGridDimensions(maze);

  // Determine distances
  const distances = matrix2d(maxX, maxY, null);
  setSquare(distances, start, 0);
  markSquareDistances(maze, distances, 0, start);

  // Walk shortest path, if a path was found
  if (!getSquare(distances, end)) return [];
  return getSteps(maze, distances, end);
};

export default dijkstraShortestPath;
