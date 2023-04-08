import { HashRing } from "../consistenthash/consistenthash.ts";
import { assertEquals } from "../deps.ts";

Deno.test("test Consistenthash", () => {
  const hash = new HashRing(3, (key: string | Uint8Array) => {
    if (typeof key === "string") {
      return parseInt(key);
    } else {
      //TODO:deal with Uint8Array
      return 1;
    }
  });
  hash.Add("6", "4", "2");
  const testMap = new Map([["2", "2"], ["11", "2"], ["23", "4"], ["27", "2"]]);
  testMap.forEach((v, k) => {
    assertEquals(hash.Get(k), v);
  });

  hash.Add("8");
  testMap.set("27", "8");
  testMap.forEach((v, k) => {
    assertEquals(hash.Get(k), v);
  });
});
