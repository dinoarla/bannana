import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

export function parseDbUrl(raw: string): mysql.PoolOptions {
  const url = raw.trim().replace(/^["']|["']$/g, "");
  // mysql://user:pass@host:port/database
  const m = url.match(/^mysql2?:\/\/([^:]+):([^@]*)@([^/:]+)(?::(\d+))?\/(.+)$/);
  if (!m) throw new Error(`Invalid DATABASE_URL format. Got: ${url.slice(0, 40)}...`);
  return {
    user: decodeURIComponent(m[1]),
    password: decodeURIComponent(m[2]),
    host: m[3],
    port: m[4] ? parseInt(m[4], 10) : 3306,
    database: m[5].split("?")[0], // strip query string if any
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
