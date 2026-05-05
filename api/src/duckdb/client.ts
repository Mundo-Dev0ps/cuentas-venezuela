import { DuckDBInstance, type DuckDBConnection } from "@duckdb/node-api";

let instancePromise: Promise<DuckDBInstance> | null = null;

async function getInstance(): Promise<DuckDBInstance> {
  if (!instancePromise) {
    instancePromise = DuckDBInstance.create(":memory:");
  }
  return instancePromise;
}

async function configureS3(conn: DuckDBConnection): Promise<void> {
  const rawEndpoint = process.env.S3_ENDPOINT ?? "";
  const useSsl = rawEndpoint.startsWith("https");
  const endpoint = rawEndpoint.replace(/^https?:\/\//, "");

  await conn.run("INSTALL httpfs;").catch(() => {});
  await conn.run("LOAD httpfs;");
  await conn.run(`SET s3_endpoint='${endpoint}';`);
  await conn.run(`SET s3_url_style='path';`);
  await conn.run(`SET s3_use_ssl=${useSsl ? "true" : "false"};`);
  await conn.run(`SET s3_region='${process.env.S3_REGION ?? "auto"}';`);
  await conn.run(`SET s3_access_key_id='${process.env.S3_KEY ?? ""}';`);
  await conn.run(
    `SET s3_secret_access_key='${process.env.S3_SECRET ?? ""}';`,
  );
}

export const duckdb = {
  async query<T = Record<string, unknown>>(sql: string): Promise<T[]> {
    const inst = await getInstance();
    const conn = await inst.connect();
    await configureS3(conn);
    const reader = await conn.runAndReadAll(sql);
    const rows = reader.getRowObjects() as T[];
    return rows.map(
      (r) => normalizeBigInts(r as Record<string, unknown>) as T,
    );
  },
};

function normalizeBigInts(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "bigint" ? Number(v) : v;
  }
  return out;
}
