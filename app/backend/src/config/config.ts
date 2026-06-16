export type TConfig = {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  FRONTEND_ORIGIN: string;
  SERVER_DOMAIN: string;
  PGHOSTNAME: string;
  PGPORT: number;
  PGDBNAME: string;
  PGUSER: string;
  PGPWD: string;
  DATABASE_URL: string;
  SALT_ROUNDS: number;
  JWT_SECRET: string;
};

export let environmentConfig: TConfig;

export function getEnvironmentConfig(): TConfig {
  if (environmentConfig) return environmentConfig;

  environmentConfig = {} as TConfig;

  environmentConfig.NODE_ENV = getEnvironment("NODE_ENV", "development") as
    | "development"
    | "production";
  environmentConfig.PORT = +getEnvironment("PORT", "3001");
  environmentConfig.FRONTEND_ORIGIN = getEnvironment(
    "FRONTEND_ORIGIN",
    "http://localhost:3000",
  );

  environmentConfig.PGHOSTNAME = getEnvironment("PGHOSTNAME", "localhost");
  environmentConfig.PGPORT = +getEnvironment("PGPORT", "5432");
  environmentConfig.PGDBNAME = getEnvironment("PGDBNAME", "postgres");
  environmentConfig.PGUSER = getEnvironment("PGUSER", "postgres");
  environmentConfig.PGPWD = getEnvironment("PGPWD", "password");
  environmentConfig.SERVER_DOMAIN = getEnvironment("SERVER_DOMAIN");

  environmentConfig.DATABASE_URL = getEnvironment(
    "DATABASE_URL",
    `postgresql://${environmentConfig.PGUSER}:${environmentConfig.PGPWD}@${environmentConfig.PGHOSTNAME}:${environmentConfig.PGPORT}/${environmentConfig.PGDBNAME}`,
  );

  environmentConfig.SALT_ROUNDS = +getEnvironment("SALT_ROUNDS", "10");
  environmentConfig.JWT_SECRET = getEnvironment(
    "JWT_SECRET",
    "super-secret-development-key",
  );

  return environmentConfig;
}

function getEnvironment(var_name: string, def_value?: string): string {
  const env_value = process.env[var_name] || def_value;
  if (!env_value) {
    throw new Error(`Environment variable not defined: ${var_name}`);
  }
  return env_value;
}
