import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

export function parseDbUrl(raw: string): mysql.PoolOptions {
  const url = raw.trim().replace(/^["']|["']$/g, "").replace(/^mysql2?:\/\//, "");

  // Use lastIndexOf("@") so passwords containing "@" are handled correctly
  const lastAt = url.lastIndexOf("@");
  if (lastAt === -1) throw new Error("DATABASE_URL missing @");

  const userInfo = url.slice(0, lastAt);          // "user:password"
  const hostInfo = url.slice(lastAt + 1);          // "host:port/database"

  const colonInUser = userInfo.indexOf(":");
  if (colonInUser === -1) throw new Error("DATABASE_URL missing : between user and password");
  const user     = decodeURIComponent(userInfo.slice(0, colonInUser));
  const password = decodeURIComponent(userInfo.slice(colonInUser + 1));

  const slashIdx  = hostInfo.indexOf("/");
  const hostPort  = slashIdx !== -1 ? hostInfo.slice(0, slashIdx) : hostInfo;
  const database  = slashIdx !== -1 ? hostInfo.slice(slashIdx + 1).split("?")[0] : "";

  const colonInHost = hostPort.lastIndexOf(":");
  const host = colonInHost !== -1 ? hostPort.slice(0, colonInHost) : hostPort;
  const port = colonInHost !== -1 ? parseInt(hostPort.slice(colonInHost + 1), 10) : 3306;

  return { user, password, host, port, database, waitForConnections: true, connectionLimit: 5, queueLimit: 0, timezone: "+00:00" };
}

if (!globalForDb.db) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.db = mysql.createPool(parseDbUrl(url));
}

export const db: mysql.Pool = globalForDb.db;
