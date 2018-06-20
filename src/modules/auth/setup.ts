import { createIndexes, createTable } from "../../db";

export default async function setup() {
  await createTable(
    "identity",
    `CREATE TABLE identity (
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL,
        enabled INTEGER NOT NULL,
        domain TEXT,
        about TEXT,
        CONSTRAINT unique_identity_id UNIQUE (id),
        CONSTRAINT unique_identity_domain UNIQUE (domain)
      )`
  );

  await createIndexes("identity", ["id"]);
  await createIndexes("identity", ["domain"]);

  await createTable(
    "user",
    `CREATE TABLE user (
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        network_id TEXT NOT NULL,
        primary_identity_id TEXT,
        CONSTRAINT unique_user_id UNIQUE (id)
      )`
  );

  await createIndexes("user", ["id"]);
  await createIndexes("user", ["primary_identity_id"]);

  await createTable(
    "membership",
    `CREATE TABLE membership ( 
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        identity_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        membership_type INTEGER NOT NULL,
        FOREIGN KEY(identity_id) REFERENCES identity(id),
        FOREIGN KEY(user_id) REFERENCES user(id)
      )`
  );

  await createIndexes("membership", ["identity_id"]);
  await createIndexes("membership", ["user_id"]);
  await createIndexes("membership", ["identity_id", "user_id"]);
}
