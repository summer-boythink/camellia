// deno-lint-ignore-file no-explicit-any
import { Lru } from "../lru/lru.ts";

export class Cache {
  lru: Lru<any>;

  constructor(maxNums: number) {
    this.lru = new Lru(maxNums, null);
  }
}
