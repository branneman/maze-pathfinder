const query = (selector, parent = document) => parent.querySelector(selector);

const queryAll = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const reflow = element => element.offsetHeight;

export { query, queryAll, reflow };
