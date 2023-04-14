export interface PeerPicker<T> {
  PickPeer(key: string): PeerGetter<T> | undefined;
}

export interface PeerGetter<T> {
  Get(group: string, key: string): Promise<T>;
}
