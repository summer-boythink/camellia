import { assertEquals } from "../deps.ts";
import { GetGroup, Group } from "../main.ts";

Deno.test("test Get", async () => {
  const db = new Map([
    ["Tom", "630"],
    ["Jack", "555"],
    ["Sam", "222"],
  ]);
  let count = 0;

  const camellia = new Group("first", (key: string): string => {
    console.log("search from db");
    const res = db.get(key);
    if (res !== undefined) {
      count++;
      return res;
    } else {
      return "nono";
    }
  }, 20);

  for (let i = 0; i < 2; i++) {
    db.forEach(async (v, k) => {
      assertEquals(await camellia.Get(k), v);
    });
  }
  assertEquals(count, 3);
  assertEquals(await camellia.Get("unknown"), "nono");
  assertEquals(GetGroup("first"), camellia);
});
