/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.raw(/* sql */ `
    create type job_remote_status as enum ('remote', 'hybrid', 'onsite');
    create type job_experience_level as enum ('internship', 'entry', 'mid', 'senior', 'lead', 'manager', 'executive');
    create type job_type as enum ('full_time', 'part_time', 'contract', 'temporary', 'internship', 'volunteer', 'remote');
    create type job_pay_type as enum ('hourly', 'daily', 'weekly', 'bi_weekly', 'monthly', 'yearly');
  `);

  await knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title', 255).notNullable();
    table.string('description', 1_024);
    table.string('url', 2_048).notNullable();
    table.timestamp('date_posted');
    table.specificType('remote_status', 'job_remote_status').notNullable();
    table.string('location', 1_024);
    table.string('company', 255);
    table.specificType('experience_level', 'job_experience_level').notNullable();
    table.specificType('type', 'job_type').notNullable();
    table.float('pay_min');
    table.float('pay_max');
    table.specificType('pay_type', 'job_pay_type');
    table.boolean('archived').notNullable().defaultTo(false);
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(/* sql */ `
    create trigger set_updated_at
    before update on
    jobs for each row
    execute procedure set_current_timestamp_updated_at();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable('jobs');
};
