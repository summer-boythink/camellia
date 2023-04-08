import { assertArrayIncludes, assertEquals } from "../deps.ts";
import { entry, EvictedFunc, Lru } from "../lru/lru.ts";

Deno.test("test lru get", () => {
  const lru = new Lru(1, null);
  lru.Set("k1", 22);
  const v1 = lru.Get("k1");
  assertEquals(v1, 22);
  const v2 = lru.Get("k2");
  assertEquals(v2, undefined);
});

Deno.test("test lru removeOld", () => {
  const lru = new Lru<number>(2, null);
  lru.Set("k1", 11);
  lru.Set("k2", 22);
  lru.Set("k3", 33);
  assertEquals(lru.Len(), 2);
  assertEquals(lru.Get("k1"), undefined);
  assertEquals(lru.Get("k2"), 22);
  assertEquals(lru.Get("k3"), 33);
});

Deno.test("callback func", () => {
  const res: Array<entry<number>> = [];
  const cb: EvictedFunc<number> = (key: string, v: number) => {
    res.push([key, v]);
  };
  const lru = new Lru<number>(2, cb);
  lru.Set("k1", 11);
  lru.Set("k2", 22);
  lru.Set("k3", 33);
  assertArrayIncludes<entry<number>>(res, [["k1", 11]]);
});
