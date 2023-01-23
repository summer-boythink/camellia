import { GetGroup } from "../main.ts";
import { ResponseJson } from "./ResponseInterface.ts";

// It is the prefix of the communication address between nodes
export const CAMELLIA_BASE_PATH = "_camellia";

/**
 * http server that provides semellia cache
 */
export class HttpPool {
  listenOptions: Deno.TcpListenOptions;
  basePath: string;
  constructor(listenOptions?: Deno.TcpListenOptions) {
    this.listenOptions = listenOptions ?? { port: 8080 };
    this.basePath = CAMELLIA_BASE_PATH;
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
