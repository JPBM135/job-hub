FROM node:22.0.0-alpine

# Set the working directory
WORKDIR /app

COPY . .

RUN yarn install

# Build the app
RUN yarn workspace @job-hub/server build

# Expose the port
EXPOSE 4000

# Start the app
CMD ["yarn", "workspace", "@job-hub/server", "start"]

