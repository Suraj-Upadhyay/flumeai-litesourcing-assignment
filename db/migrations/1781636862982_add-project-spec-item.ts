import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    create type project_status as enum (
      'draft', 'sourcing', 'quoted', 'closed'
    );

    create table if not exists projects (
      id int generated always as identity primary key,
      project_name varchar not null,
      client_name varchar not null,
      project_status project_status not null default 'draft'::project_status,
      created_at timestamp not null default now(),
      updated_at timestamp
    );

    create table if not exists spec_items (
      id int generated always as identity primary key,
      project_id int not null,
      name varchar not null,
      description varchar,
      category_id int not null,
      quantity numeric not null,
      unit_of_measure_id int not null,
      created_at timestamp not null default now(),
      updated_at timestamp
    );

    alter table spec_items
    add constraint fk_project_id
    foreign key (project_id)
    references projects(id)
    on delete cascade,
    add constraint fk_category_id
    foreign key (category_id)
    references categories(id)
    on delete cascade;

    create table if not exists spec_item_products (
      spec_item_id int not null,
      product_id int not null,
      is_winning boolean not null default false
    );

    alter table spec_item_products
    add constraint fk_spec_item_id
    foreign key (spec_item_id)
    references spec_items(id)
    on delete cascade,
    add constraint fk_product_id
    foreign key (product_id)
    references products(id)
    on delete cascade;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    drop table if exists spec_item_products;
    drop table if exists spec_items;
    drop table if exists projects;
    drop type project_status;
  `);
}
