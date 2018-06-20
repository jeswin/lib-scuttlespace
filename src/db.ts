import pg = require("pg");
import * as config from "./config";
import { log } from "./logger";

export interface IDbConfig {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

let pool: pg.Pool;
export async function setDbConfiguration(dbConfig: IDbConfig) {
  pool = new pg.Pool(dbConfig);
}

export async function withClient<T>(
  fn: (client: pg.PoolClient) => Promise<T | undefined>
): Promise<T | undefined> {
  const client = await pool.connect();
  const result = fn(client);
  client.release();
  return result;
}

let database: Database | undefined;
export async function getDb() {
  if (!database) {
    database = new Database(dbName);
  }
  return database;
}

export async function resetDb() {
  database = undefined;
}

export async function databaseExists() {
  const db = await getDb();
  const query = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table';`
  );
  return query.all().length > 0;
}

export async function createTable(table: string, createStatement: string) {
  const db = await getDb();
  db.prepare(createStatement).run();
  log(`Created ${table} table.`);
}

export async function createIndexes(table: string, fields: string[]) {
  const indexName = `${table}_${fields.join("_")}`;
  const db = await getDb();
  db.prepare(
    `CREATE INDEX ${indexName} ON ${table}(${fields.join(", ")})`
  ).run();
  log(`Created index ${indexName} ON ${table}(${fields.join(", ")}).`);
}

function columnsFromField(fields: string[]) {
  return fields.map(x => (x.includes("=") ? x.split("=")[0] : x));
}

function paramsFromField(fields: string[]) {
  return fields.map(x => (x.includes("=") ? x.split("=")[1] : x));
}

export function sqlInsert(args: { table: string; fields: string[] }) {
  const { table, fields } = args;
  const sql = `INSERT INTO ${table} (${columnsFromField(fields).join(
    ", "
  )}) VALUES(${paramsFromField(fields)
    .map(x => `$${x}`)
    .join(", ")})`;

  return sql;
}
