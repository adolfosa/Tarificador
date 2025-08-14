// /lib/mysql.ts
import mysql, { Pool, PoolOptions } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: Pool | undefined;
}

function createPool() {
  const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_USE_SSL,
    MYSQL_SSL_INSECURE,
  } = process.env;

  if (!MYSQL_HOST || !MYSQL_PORT || !MYSQL_DATABASE || !MYSQL_USER || !MYSQL_PASSWORD) {
    throw new Error("Faltan variables de entorno MySQL.");
  }

  const opts: PoolOptions = {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  const useSSL = (MYSQL_USE_SSL ?? "true").toLowerCase() === "true";
  const insecure = (MYSQL_SSL_INSECURE ?? "false").toLowerCase() === "true";

  if (useSSL) {
    if (insecure) {
      // 🔓 Dev: TLS sin verificación de cadena/host
      (opts as any).ssl = { rejectUnauthorized: false, minVersion: "TLSv1.2" };
    } else {
      // Prod (si luego vuelves a verificación; necesitarás CA)
      (opts as any).ssl = { rejectUnauthorized: true, minVersion: "TLSv1.2" };
    }
  }

  return mysql.createPool(opts);
}

const pool = global._mysqlPool ?? createPool();
if (!global._mysqlPool) global._mysqlPool = pool;

export default pool;

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}
