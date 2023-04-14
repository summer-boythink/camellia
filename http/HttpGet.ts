import { PeerGetter } from "../nodes/peer.ts";

/**
 * client for `HTTPPool`
 */
export class HttpGet<T> implements PeerGetter<T> {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async Get(group: string, key: string): Promise<T> {
    const url = `${this.baseUrl}/${group}/${key}`;
    const res = await fetch(url);
    const jsonData = res.json();
    return jsonData;
  }
}
