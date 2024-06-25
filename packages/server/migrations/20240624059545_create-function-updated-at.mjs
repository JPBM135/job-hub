/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.raw(/* sql */ `
		drop function if exists public.set_current_timestamp_updated_at();
		create function public.set_current_timestamp_updated_at() RETURNS trigger
				language plpgsql
				as $$
		declare
			_new record;
		begin
			_new := NEW;
			_new."updated_at" = NOW();
			return _new;
		end;
		$$;

		do $_$
			begin
			if not exists (select 1 from pg_proc where proname = 'gen_random_uuid') then
				create extension if not exists "uuid-ossp";
				create function gen_random_uuid()
				returns uuid
				language sql
				as $$
				select uuid_generate_v4()
				$$;
			end if;
			end
		$_$;
	`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.raw(/* sql */ `
		drop trigger if exists public.set_current_timestamp_updated_at on public.users;
		drop function if exists public.set_current_timestamp_updated_at();
	`);
  await knex.schema.dropTableIfExists('users');
};
