import DoublyLinkedList from "../links/doubleLink.ts";

/**
 * callback func of Cache
 */
export type EvictedFunc<T> = (key: string, value: T) => void;

/**
 * entry is DoublyNode's Element
 * design key for quicking get cache key
 */
export type entry<T> = [key: string, value: T];

export class Cache<T> {
  /**
   * maxNums is The maximum memory allowed
   */
  maxNums: number;

  /**
   * usedNums is used memory
   */
  private usedNums: number;

  /**
   * dl is a DoublyLinkedList
   */
  dl: DoublyLinkedList<entry<T>>;

  /**
   * onEvicted is callback func when a recode be removed
   */
  onEvicted: EvictedFunc<T> | null;

  /**
   * when add and set a value will push the value to cache
   */
  cache: Map<string, T>;

  constructor(maxBytes: number, onEvicted: EvictedFunc<T> | null) {
    this.maxNums = maxBytes;
    this.dl = new DoublyLinkedList<entry<T>>();
    this.onEvicted = onEvicted;
    this.usedNums = 0;
    this.cache = new Map<string, T>();
  }

  /**
   * return list length
   * @returns {number}
   */
  Len(): number {
    return this.dl.size();
  }

  /**
   * return a cache value
   * @param key
   */
  Get(key: string): T | undefined {
    const val = this.cache.get(key);
    if (val !== undefined) {
      // move front (front as best pos)
      const e: entry<T> = [key, val];
      this.dl.MoveFront(e);
      return val;
    }
    return undefined;
  }

  RemoveOldest() {
    const e = this.dl.removeAt(this.dl.size() - 1);
    if (e !== undefined) {
      this.cache.delete(e[0]);
      this.usedNums -= 1;
      if (this.onEvicted !== null) {
        this.onEvicted(e[0], e[1]);
      }
    }
  }

  /**
   * add a new Element or update a Element
   * @param key
   * @param value
   */
  Set(key: string, value: T) {
    const val = this.cache.get(key);
    if (val != undefined) {
      // val in dl,move front
      const e: entry<T> = [key, val];
      this.dl.MoveFront(e);
      this.dl.getHead()!.element = e;
    } else {
      // val not live,add it
      const e: entry<T> = [key, value];
      this.dl.insert(e, 0);
      this.cache.set(key, value);
      this.usedNums += 1;
    }

    // clean oldElement
    while (this.maxNums !== 0 && this.maxNums < this.usedNums) {
      this.RemoveOldest();
    }
  }
}
