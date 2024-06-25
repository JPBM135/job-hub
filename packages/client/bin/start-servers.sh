unset npm_config_prefix && npx concurrently -k -n server,client -c bgGreen,bgBlue \
"yarn workspace @job-hub/server start-watch" \
"yarn start"

