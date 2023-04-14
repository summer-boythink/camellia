import { PeerGetter } from "../nodes/peer.ts";

/**
 * client for `HTTPPool`
 */
export class HttpGet implements PeerGetter {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // deno-lint-ignore no-explicit-any
  async Get(group: string, key: string): Promise<any> {
    const url = `${this.baseUrl}${group}/${key}`;
    const res = await fetch(url);
    const jsonData = res.json();
    return jsonData;
  }
}
