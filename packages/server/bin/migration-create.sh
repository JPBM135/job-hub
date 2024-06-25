name="$1"

npx knex migrate:make "$name"

created_migration=$(ls -t ./migrations | head -1)

mv "./migrations/$created_migration" "./migrations/${created_migration%.js}.mjs"