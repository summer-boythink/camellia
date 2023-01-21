import { Cache } from "./cache/cache.ts";

// TODO:better type
// When the data doesn't exist,`Getter` will be callback
export type Getter = (key: string) => string;

// Store all Group
export let groups: Map<string, Group>;

// A cached namespace where each Group has a unique `name`
export class Group {
  name: string;
  getter: Getter;
  maxNums?: number;
  cacheStore: Cache;
  constructor(name: string, getter: Getter, maxNums?: number) {
    this.name = name;
    if (getter == null) {
      throw new Error("null getter");
    }
    this.getter = getter;
    this.maxNums = maxNums === undefined ? 10 : maxNums;
    this.cacheStore = new Cache(this.maxNums);
    groups.set(name, this);
  }
}

export function GetGroup(name: string): Group | undefined {
  return groups.get(name);
}
