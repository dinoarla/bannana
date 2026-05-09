import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

if (!globalForDb.db) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.db = mysql.createPool(url);
}

export const db: mysql.Pool = globalForDb.db;
