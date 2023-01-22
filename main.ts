// deno-lint-ignore-file no-explicit-any
import { Cache } from "./cache/cache.ts";

// TODO:better type
// When the data doesn't exist,`Getter` will be callback
export type Getter<T> = (key: string) => T;

// Store all Group
export const AllGroups: Map<string, Group<any>> = new Map();

/**
 *  A cached namespace where each Group has a unique `name`
 */
export class Group<T> {
  // Each Group has a unique `name` as an identifier
  name: string;
  // getter is called when the cache does not hit
  getter: Getter<T>;
  // The maximum lru allowed
  maxNums?: number;
  // Used to store data
  cacheStore: Cache<T>;

  constructor(name: string, getter: Getter<T>, maxNums?: number) {
    this.name = name;
    if (getter == null) {
      throw new Error("null getter");
    }
    this.getter = getter;
    this.maxNums = maxNums === undefined ? 10 : maxNums;
    this.cacheStore = new Cache<T>(this.maxNums);
    AllGroups.set(name, this);
  }

  /**
   * If the key exists in the `cacheStore`,
   * get the value from the `cacheStore`,
   * otherwise call the `getter` to get the new value
   * @param key
   * @returns
   */
  public Get(key: string): T {
    if (key.length === 0) throw new Error("param key is required");
    const val = this.cacheStore.get(key);
    if (val !== undefined) {
      console.log("Camellia Cache hit!");
      return val;
    }
    return this.load(key);
  }

  private load(key: string): T {
    return this.getLocally(key);
  }

  /**
   * call the `getter` to get the new value
   * @param key
   * @returns
   */
  private getLocally(key: string): T {
    const locallyData = this.getter(key);
    //TODO:better check typeof locallyData === T
    this.cacheStore.add(key, locallyData);
    return locallyData;
  }
}

/**
 * Returns a class Group, if the Group exists
 * @param name
 */
export function GetGroup(name: string): Group<any> | undefined {
  return AllGroups.get(name);
}
