#!/bin/bash

deno compile -A multi_node.ts

trap "rm multi_node;kill 0" EXIT

./multi_node --port 8081 &
./multi_node --port 8082 --api 1 &
./multi_node --port 8083  &

sleep 2
echo ">>> start test"
curl "http://localhost:9999/api?key=Tom" &
curl "http://localhost:9999/api?key=Tom" &
curl "http://localhost:9999/api?key=Tom" &

wait