import { HashRing } from "../consistenthash/consistenthash.ts";
import { GetGroup } from "../main.ts";
import { PeerGetter, PeerPicker } from "../nodes/peer.ts";
import { HttpGet } from "./HttpGet.ts";
import { ResponseJson } from "./ResponseInterface.ts";

// It is the prefix of the communication address between nodes
export const CAMELLIA_BASE_PATH = "_camellia";

// It is replicas of consistenthash
export const DEFAULT_REPLICAS = 50;

/**
 * http server that provides semellia cache
 */
export class HttpPool implements PeerPicker {
  listenOptions: Deno.TcpListenOptions;

  // Its own url is used to distinguish it from peers
  selfUrl: string;

  // Distributed nodes
  peers: HashRing | undefined;

  // client for `HTTPPool`
  httpGetters: Map<string, HttpGet> | undefined;

  // basePath of camelllia
  basePath: string;

  constructor(listenOptions?: Deno.TcpListenOptions, selfUrl?: string) {
    this.listenOptions = listenOptions ?? { port: 8080 };
    this.selfUrl = selfUrl ?? `http://localhost:${this.listenOptions.port}`;
    this.basePath = CAMELLIA_BASE_PATH;
  }

  /**
   * Set updates the pool's list of peers.
   */
  Set(...peers: string[]) {
    this.peers = new HashRing(DEFAULT_REPLICAS);
    this.peers.Add(...peers);
    this.httpGetters = new Map();
    for (const peer of peers) {
      this.httpGetters.set(peer, new HttpGet(peer + this.basePath));
    }
  }

  /**
   * PickPeer picks a peer according to key
   */
  PickPeer(key: string): PeerGetter | undefined {
    const peer = this.peers?.Get(key);
    if (peer !== undefined && peer !== this.selfUrl) {
      console.log(`Pick peer ${peer}`);
      return this.httpGetters?.get(peer);
    }
    return undefined;
  }

  /**
   * Provide an http server that retrieves data from Camellia,
   * Follow the http format below
   *  ---------------------
   * http://[host]:[port]/_camellia/[GroupName]/[Key]
   * @returns
   */
  async serve() {
    const httpServers = Deno.listen(this.listenOptions);
    console.log("server be opened in", this.listenOptions.port);
    for await (const conn of httpServers) {
      const httpConn = Deno.serveHttp(conn);
      for await (const requestEvent of httpConn) {
        const url = requestEvent.request.url;
        const parts = url.split("/");
        if (parts[parts.length - 3] !== this.basePath) {
          ResponseJson(requestEvent, {
            status: 200,
            message: `camellia path error`,
          });
          continue;
        }

        const groupName = parts[parts.length - 2];
        const key = parts[parts.length - 1];
        const group = GetGroup(groupName);
        if (group === undefined) {
          ResponseJson(requestEvent, {
            status: 200,
            message: `camellia can't obtain the ${groupName} group`,
          });
          continue;
        }

        const data = group!.Get(key);
        ResponseJson(requestEvent, {
          data: data,
          status: 200,
          message: "camellia get cache",
        });
      }
    }
    return httpServers;
  }
}
