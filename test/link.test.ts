import DoubleLink from "../links/doubleLink.ts";
import { assertEquals } from "../deps.ts";

Deno.test("test DoubleLink", () => {
  const dl = new DoubleLink<number>();
  const nodes = [1, 2, 3, 4, 5, 6];
  nodes.forEach((v) => {
    dl.push(v);
  });
  assertEquals(dl.getHead()?.element, 1);
  assertEquals(dl.getNodeAt(3)?.element, 4);
  assertEquals(dl.getTail()?.prev?.element, 5);
  dl.MoveFront(4);
  assertEquals(dl.getHead()?.element, 4);
  assertEquals(dl.getNodeAt(3)?.element, 1);
});
