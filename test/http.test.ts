// import { HttpPool } from "../http/HTTPPool.ts";
// import { Group } from "../main.ts";

// Deno.test("test http", async () => {
//   const db = new Map([
//     ["Tom", "111"],
//     ["Jack", "222"],
//     ["Sam", "333"],
//   ]);

//   new Group("http_test", (key: string): string => {
//     console.log("search from db");
//     const res = db.get(key);
//     if (res !== undefined) {
//       return res;
//     } else {
//       return "nono";
//     }
//   }, 20);

//   const peers = new HttpPool({ port: 9777 });
//   const listener = peers.serve();
//   // (await listener).close();
//   const jsonResponse = await fetch(
//     "http://localhost:9777/_camellia/http_test/Tom",
//   );
//   const jsonData = await jsonResponse.json();
//   console.log(jsonData);
//   (await listener).close();
// });
