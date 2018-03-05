class Serializer {
  serialize(value) {
    return value
      .map(row => row.join(''))
      .join('-')
      .replace(/#/g, '1')
      .replace(/\./g, '0');
  }

  deserialize(value) {
    try {
      return value
        .replace(/0/g, '.')
        .replace(/1/g, '#')
        .split(/-/)
        .map(row => row.split(''));
    } catch (e) {}
    return false;
  }
}

export default new Serializer();
