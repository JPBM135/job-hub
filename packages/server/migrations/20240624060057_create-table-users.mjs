/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')).comment('Unique identifier');
    table.string('email').notNullable().unique().comment('Email address');
    table.string('password').notNullable().comment('Password');
    table.string('name').notNullable().comment('Name');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()).comment('Creation date');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()).comment('Last update date');
  });

  await knex.raw(/* sql */ `
    create trigger set_current_timestamp_updated_at
    before update on users
    for each row
    execute function set_current_timestamp_updated_at();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable('users');
};
