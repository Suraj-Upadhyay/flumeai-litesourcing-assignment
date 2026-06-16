// migrate.config.ts
module.exports = {
  migrationFolder: "migrations",
  "migration-filename-format": "utc",
  "migrations-dir": "./migrations",
  direction: "up",
  migrationsTable: "pgmigrations",
  logFile: "migrate.log",
  verbose: true,
  user: process.env.PGUSER,
  password: process.env.PGPWD,
  host: process.env.PGHOSTNAME,
  port: process.env.PGPORT,
  database: process.env.PGDBNAME,
  language: "js",
};
