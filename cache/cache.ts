import { Lru } from "../lru/lru.ts";

/**
 * export 'Lru' for `camellia` service
 */
export class Cache<T> {
  lru: Lru<T>;

  constructor(maxNums: number) {
    this.lru = new Lru(maxNums, null);
  }

  add(key: string, val: T) {
    this.lru.Set(key, val);
  }

  get(key: string): T | undefined {
    return this.lru.Get(key);
  }
}
