import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

// Both drivers implement the same Drizzle query-builder surface; routes only
// rely on shared methods (select/insert/execute). Each entry file wires up
// its own driver and injects the resulting Db into the Hono context.
//
//   - Workers (prod):   src/index.ts        → drizzle-orm/neon-http
//   - Node (compose):   src/dev-server.ts   → drizzle-orm/postgres-js
export type Db =
  | NeonHttpDatabase<typeof schema>
  | PostgresJsDatabase<typeof schema>;

export { schema };
