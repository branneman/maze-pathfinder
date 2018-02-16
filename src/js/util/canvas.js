/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
const drawLine = (ctx, x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
const drawRect = (ctx, x1, y1, x2, y2) => {
  drawLine(ctx, x1, y1, x2, y1);
  drawLine(ctx, x2, y1, x2, y2);
  drawLine(ctx, x2, y2, x1, y2);
  drawLine(ctx, x1, y2, x1, y1);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} size Number of columns & rows
 * @param {Number} margin Number of pixels margin
 */
const drawSquareGrid = (ctx, size, margin) => {
  const px = Math.floor((ctx.canvas.width - margin) / size);
  for (let x = 0; x <= size; x++) {
    for (let y = 0; y <= size; y++) {
      drawRect(
        ctx,
        x * px + margin,
        y * px + margin,
        (x + 1) * px + margin,
        (y + 1) * px + margin
      );
    }
  }
};

export { drawLine, drawRect, drawSquareGrid };
