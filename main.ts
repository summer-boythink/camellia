// deno-lint-ignore-file no-explicit-any
import { Cache } from "./cache/cache.ts";
import { PeerGetter, PeerPicker } from "./nodes/peer.ts";

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
  // Distributed nodes
  peers: PeerPicker<T> | undefined;

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
   * RegisterPeers registers a PeerPicker for choosing remote peer
   */
  RegisterPeers(peers: PeerPicker<T>) {
    if (this.peers !== undefined) {
      throw Error("RegisterPeerPicker called more than once");
    }
    this.peers = peers;
  }

  /**
   * If the key exists in the `cacheStore`,
   * get the value from the `cacheStore`,
   * otherwise call the `getter` to get the new value
   */
  async Get(key: string): Promise<T> {
    if (key.length === 0) throw new Error("param key is required");
    const val = this.cacheStore.get(key);
    if (val !== undefined) {
      console.log("Camellia Cache hit!");
      return val;
    }
    return await this.load(key);
  }

  private async load(key: string): Promise<T> {
    if (this.peers !== undefined) {
      const peer = this.peers.PickPeer(key);
      if (peer !== undefined) {
        return await this.getFromPeer(peer, key);
      }
    }

    return this.getLocally(key);
  }

  /**
   * Get value from peer
   */
  private async getFromPeer(peer: PeerGetter<T>, key: string): Promise<T> {
    return await peer.Get(this.name, key);
  }

  /**
   * call the `getter` to get the new value
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
