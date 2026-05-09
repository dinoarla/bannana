import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

function parseDbUrl(raw: string): mysql.PoolOptions {
  const u = new URL(raw.trim());
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    timezone: "+00:00",
  };
}

if (!globalForDb.db) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.db = mysql.createPool(parseDbUrl(url));
}

export const db: mysql.Pool = globalForDb.db;
