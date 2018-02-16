import { fill, matrix2d, findValue } from '../util/grid';

const isOutOfBounds = ([x, y], maxX, maxY) =>
  x < 0 || y < 0 || x >= maxX || y >= maxY;
const isWall = (grid, [x, y]) => grid[y][x] === '#';

const getSquare = (grid, [x, y]) => grid[y][x];

const setSquare = (grid, [x, y], value) => (grid[y][x] = value);

const getGridDimensions = grid => ({ maxX: grid[0].length, maxY: grid.length });

const isValidSquare = (grid, square) => {
  const { maxX, maxY } = getGridDimensions(grid);
  const outOfBounds = isOutOfBounds(square, maxX, maxY);
  if (outOfBounds) return false;
  return !isWall(grid, square);
};

const haveVisitedSquare = (grid, [x, y], value) => {
  const isAlreadySet = typeof grid[y][x] === 'number';
  const isHigherNumber = grid[y][x] > value;
  return !isAlreadySet || isHigherNumber;
};

const getAdjacentSquares = square => {
  const x = square[0];
  const y = square[1];
  return [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]];
};

const markSquareDistances = (maze, distances, iteration, currentSquare) => {
  iteration++;

  getAdjacentSquares(currentSquare)
    .filter(square => isValidSquare(maze, square))
    .filter(square => haveVisitedSquare(distances, square, iteration))
    .forEach(square => {
      setSquare(distances, square, iteration);
      markSquareDistances(maze, distances, iteration, square);
    });
};

const getNextStep = (maze, distances, square) => {
  const squares = getAdjacentSquares(square).filter(square =>
    isValidSquare(maze, square)
  );
  if (squares.length < 1) return false;
  squares.sort((a, b) => getSquare(distances, a) - getSquare(distances, b));
  return squares[0];
};

const getSteps = (maze, distances, currentSquare) => {
  const steps = [];
  while (true) {
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

  // Walk shortest path
  return getSteps(maze, distances, end);
};

export default dijkstraShortestPath;
