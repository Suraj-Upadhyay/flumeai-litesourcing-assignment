/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import type { PoolClient } from "pg";
import { asyncLocalStorage } from "../utility";

/**
 * Database hostname
 */
const dbHostname: string = process.env.PGHOSTNAME as string;

/**
 * Database port
 */
const dbPort: number = +(process.env.PGPORT as string);

/**
 * Database name
 */
const dbName: string = process.env.PGDBNAME as string;

/**
 * Database user
 */
const dbUser: string = process.env.PGUSER as string;

/**
 * Database password
 */
const dbPassword: string = process.env.PGPWD as string;

const application_name: string = process.env.PGAPPLICATIONNAME as string;

/**
 * Database pool instance
 */
const db = new Pool({
  host: dbHostname,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  application_name: application_name,
});

/**
 * Query decorator for managing database client connections
 * @template T - Function type
 * @param callingObject - The calling object
 * @param methodName - The method name
 * @param descriptor - The property descriptor of the method
 * @returns Modified property descriptor with a wrapped function
 */
function Query<T extends (...args: any[]) => Promise<any>>(
  callingObject: any,
  methodName: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const boundMethod = descriptor.value as T;
  descriptor.value = async function (
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    const store = asyncLocalStorage.getStore();
    let client: PoolClient = store?.get("dbClient") as PoolClient;
    let isOutermostQuery = false;
    if (client === undefined) {
      client = await db.connect();
      store?.set("dbClient", client);
      isOutermostQuery = true;
    }
    try {
      const result = await boundMethod.apply(this, [...args]);
      return result;
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      if (isOutermostQuery) {
        client.release();
        store?.delete("dbClient");
      }
    }
  };
  return descriptor;
}

/**
 * Transaction decorator for managing database transactions
 * @template T - Function type
 * @param callingObject - The calling object
 * @param methodName - The method name
 * @param descriptor - The property descriptor of the method
 * @returns Modified property descriptor with a wrapped function
 */
function Transaction<T extends (...args: any[]) => Promise<any>>(
  callingObject: any,
  methodName: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const boundMethod = descriptor.value as T;
  descriptor.value = async function (
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    const store = asyncLocalStorage.getStore();
    let client: PoolClient = store?.get("dbClient") as PoolClient;
    let isOutermostTransaction = false;
    if (client === undefined) {
      client = await db.connect();
      await client.query("BEGIN");
      store?.set("dbClient", client);
      isOutermostTransaction = true;
    }
    try {
      const result = await boundMethod.apply(this, [...args]);
      return result;
    } catch (error) {
      if (isOutermostTransaction) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      if (isOutermostTransaction) {
        await client.query("COMMIT");
        client.release();
        store?.delete("dbClient");
      }
    }
  };
  return descriptor;
}

/**
 * Function to clean up database resources
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function cleanup() {
  await db.end();
}

export default db;
export { Query, Transaction };
