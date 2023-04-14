export interface PeerPicker {
  PickPeer(key: string): PeerGetter | undefined;
}

export interface PeerGetter {
  // deno-lint-ignore no-explicit-any
  Get(group: string, key: string): Promise<any>;
}
