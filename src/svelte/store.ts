type Unsubscriber = () => boolean;
type Subscriber<D> = (value: D) => void;
type Updater<D> = (value: D) => D;

export interface DataStore<D, E> {
  /**
   * Set the value of the store and call the subscribers with the new value.
   *
   * @param value - New value of the store data.
   * @param [force] - If true, set the value even without changes, forcing the call to the subscribers. Default is false.
   * @returns
   */
  set(this: void, value: D, force?: boolean): void;
  /**
   * Subscribe to changes so that every time a different value is set the handler is run.
   *
   * @param handler - Function to run when a new value is set.
   * @returns Unsubscriber. A function used to terminate the created subscription.
   */
  subscribe(handler: Subscriber<D>): Unsubscriber;
  /**
   * Update the value of the store using a function of the current value.
   *
   * @param update_fn - Update function.
   */
  update(update_fn: Updater<D>): void;
  /**
   * Function removing every subscription.
   */
  destroy(): void;
};


/**
 * Creates a store associated for a given entity data.
 *
 * @template D - Type of the data stored.
 * @template E - Type of the entity from wich data is stored.
 * @param {D} initial - Initial value stored.
 * @param {E} entity - Entity owing the data (such as `Actor`, `Item`, ...)
 * @returns {DataStore<D, E>} Store object.
 */
export function dataStore<D, E extends Actor | Item>(initial: D, entity: E): DataStore<D, E> {
  let data = initial;
  let subscribers = new Map();

  function set(value: D, force: boolean = false) {
    // Changes are commited with entity.update. Only continue if there are changes or force = true
    if (!entity.update(value) || !force) return

    data = value;
    subscribers.forEach((unsub, sub) => sub(data));
  }

  function subscribe(handler: Subscriber<D>) {
    const unsub = () => subscribers.delete(handler);
    subscribers.set(handler, unsub);

    handler(data);

    return unsub
  }

  function update(update_fn: Updater<D>) {
    set(update_fn(data))
  }

  function destroy() {
    subscribers.forEach(unsub => {
      unsub()
    });
  }

  return { subscribe, set, update, destroy };
}
