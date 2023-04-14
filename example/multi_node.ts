import { HttpPool } from "../http/HTTPPool.ts";
import { Group } from "../main.ts";
const db = new Map([
  ["Tom", "630"],
  ["Jack", "555"],
  ["Sam", "222"],
]);

function createGroup(): Group<string> {
  return new Group("first", (key: string): string => {
    console.log("search from db");
    const res = db.get(key);
    if (res !== undefined) {
      return res;
    } else {
      return "no data";
    }
  }, 20);
}

/**
 * Private cache service, can add peer
 */
async function startCacheServer<T>(
  port: number,
  addr: string,
  addrs: string[],
  cacheGroup: Group<T>,
) {
  const peers = new HttpPool<T>({ port: port }, addr);
  peers.Set(...addrs);
  cacheGroup.RegisterPeers(peers);
  console.log("camellia is running at ", addr);
  await peers.serve();
}

/**
 * Exposed api address
 */
async function startApiServer<T>(
  apiAddrOptions: Deno.TcpListenOptions,
  cacheGroup: Group<T>,
) {
  const httpServers = Deno.listen(apiAddrOptions);
  const hostname = apiAddrOptions.hostname ?? "http://localhost";
  console.log(
    `fontend server is running at ${hostname}:${apiAddrOptions.port}`,
  );
  for await (const conn of httpServers) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      const url = requestEvent.request.url;
      const parts = url.split("?");
      const key = (parts[1].split("="))[1];
      const data = await cacheGroup.Get(key);
      requestEvent.respondWith(
        new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/octet-stream" },
        }),
      );
    }
  }
}

(async () => {
  let port: number;
  let api = 0;
  const args = Deno.args;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port") {
      port = parseInt(args[i + 1]);
    }
    if (args[i] === "--api") {
      api = parseInt(args[i + 1]);
    }
  }

  const apiAddrOptions: Deno.TcpListenOptions = { port: 9999 };
  const addrMap = new Map([[8081, "http://localhost:8081"], [
    8082,
    "http://localhost:8082",
  ], [8083, "http://localhost:8083"]]);

  const addrs: string[] = [];
  addrMap.forEach((v) => {
    addrs.push(v);
  });

  const group = createGroup();

  if (api) {
    startApiServer(apiAddrOptions, group);
  }

  await startCacheServer(port!, addrMap.get(port!)!, addrs!, group);
})();
