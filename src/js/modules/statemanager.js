import Observer from '../util/observer';

class StateManager {
  constructor(serializer, initialState) {
    this.serializer = serializer;

    this._addEventHandlers();
    this._onNavigate();
  }

  update(newState) {
    const serialized = newState ? this.serialize(newState) : '';
    window.history.pushState({}, '', '#' + encodeURIComponent(serialized));
  }

  _addEventHandlers() {
    window.addEventListener('popstate', () => this._onNavigate());
  }

  _onNavigate() {
    const hash = decodeURIComponent(window.location.hash.substr(1));
    const newState = this.deserialize(hash);
    if (!newState) return;
    Observer.publishAsync(this, 'updated', newState);
  }

  serialize(value) {
    return this.serializer.serialize(value);
  }

  deserialize(value) {
    return this.serializer.deserialize(value);
  }
}

export default StateManager;
