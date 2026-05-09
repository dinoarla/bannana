import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { db?: mysql.Pool };

export const db: mysql.Pool =
  globalForDb.db ??
  mysql.createPool({
    uri: process.env.DATABASE_URL!,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    timezone: "+00:00",
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
