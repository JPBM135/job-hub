/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.raw(/* sql */ `
    create type job_application_status as enum ('applied', 'interviewing', 'offered', 'rejected', 'hired');
  `);

  await knex.schema.createTable('jobs_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('job_id').notNullable().references('id').inTable('jobs');
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.specificType('status', 'job_application_status').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(/* sql */ `
    create trigger set_current_timestamp_updated_at
    before update on jobs_applications
    for each row
    execute function set_current_timestamp_updated_at();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable('jobs_applications');
};
