import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    alter table suppliers
    alter column country type varchar,
    alter column name type varchar,
    alter column website type varchar;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    alter table suppliers
    alter column name type varchar(255),
    alter column website type varchar(255),
    alter column country type varchar(5);
  `);
}
