import * as handlers from './http/handlers';
import { env } from './lib/env';
import { Event, HttpServer } from './net/http';
import { MemoryDb } from './storages/memory-db';

// Init DB & HTTP and combine them
const db = new MemoryDb();
const server = new HttpServer<MemoryDb>(db, env.servicePort);

// Start the http listener
server.connect();

// Print hello world
server.on(Event.Connect, ({ port }) =>
  console.log(`[i] DB is listening on http://127.0.0.1:${port}`));

// Register handlers
{
  // Set record ?k=KEY&v=VALUE [mutable]
  server.handle('/set', handlers.set);

  // Get record ?k=KEY&v=VALUE [immutable]
  server.handle('/get', handlers.get);

  // Remove record ?k=KEY [mutable]
  server.handle('/rm', handlers.rm);

  // Clear all records [mutable]
  server.handle('/clear', handlers.clear);

  // Is exists ?k=KEY [immutable]
  server.handle('/is', handlers.is);

  // Get all keys [immutable]
  server.handle('/getKeys', handlers.getKeys);

  // Get all values [immutable]
  server.handle('/getValues', handlers.getValues);

  // Get all records [immutable]
  server.handle('/getAll', handlers.getAll);

  // Get server heath status (warmup or health) [immutable]
  server.handle('/healthcheck', handlers.healthcheck);

  // Get server settings [immutable]
  server.handle('/status', handlers.status);

  // Join node to this one and make mesh [mutable]
  server.handle('/join', handlers.join);
}
