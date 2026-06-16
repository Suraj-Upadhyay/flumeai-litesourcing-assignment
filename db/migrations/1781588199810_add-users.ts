import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    create table if not exists users (
      id int generated always as identity primary key,
      username varchar not null,
      password_hash varchar,
      is_active boolean not null default true,
      deleted_at timestamp,
      created_at timestamp not null default now()
    );
  `);

  pgm.sql(`
    alter table users
    add constraint uq_users_username unique(username);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    drop table if exists users;
  `);
}
