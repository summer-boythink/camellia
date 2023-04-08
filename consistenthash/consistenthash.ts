import { crc32 } from "../deps.ts";

export type HashFunc = (data: string | Uint8Array) => number;
/**
 * HashRing constains all hashed keys
 */
export class HashRing {
  /**
   * Used hash algorithm
   */
  hash: HashFunc;

  /**
   * Virtual node multiple
   */
  replicas: number;

  /**
   * Map table of virtual and real nodes
   */
  hashMap: Map<number, string>;

  /**
   * All hash key
   */
  keys: number[];

  constructor(replicas: number, fn?: HashFunc) {
    if (fn) {
      this.hash = fn;
    } else {
      this.hash = crc32;
    }
    this.replicas = replicas;
    this.keys = [];
    this.hashMap = new Map();
  }

  /**
   * Add adds some keys to the hash.
   */
  Add(...keys: string[]) {
    for (const key of keys) {
      for (let i = 0; i < this.replicas; i++) {
        const hash = this.hash(parseInt(i + key).toString());
        this.keys.push(hash);
        this.hashMap.set(hash, key);
      }
    }
    this.keys.sort((a, b) => a - b);
  }

  /**
   * Get gets the closest item in the hash to the provided key.
   */
  Get(key: string): string | undefined {
    if (this.keys.length === 0) {
      return undefined;
    }
    const hash = parseInt(key);
    let idx = this.keys.findIndex((v) => v >= hash);
    if (idx === -1) {
      idx = this.keys.length;
    }
    return this.hashMap.get(this.keys[idx % this.keys.length]);
  }
}
