import { HttpPool } from "../http/HTTPPool.ts";
import { Group } from "../main.ts";

(async () => {
  const db = new Map([
    ["Tom", "630"],
    ["Jack", "555"],
    ["Sam", "222"],
  ]);

  new Group("first", (key: string): string => {
    console.log("search from db");
    const res = db.get(key);
    if (res !== undefined) {
      return res;
    } else {
      return "nono";
    }
  }, 20);

  const peers = new HttpPool({ port: 9777 });
  await peers.serve();
})();
