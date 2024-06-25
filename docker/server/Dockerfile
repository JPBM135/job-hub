FROM ubuntu:20.04 as cert-generator

RUN apt-get update && apt-get install -y openssl

WORKDIR /certs

RUN openssl req -x509 -newkey rsa:4096 -keyout privatekey.pem -out certificate.pem -days 365 -nodes -subj '/CN=localhost'


FROM node:22.0.0-alpine

# Set the working directory
WORKDIR /app

COPY . .

# Copy the certificates
COPY --from=cert-generator /certs/privatekey.pem /job-hub/privatekey.pem
COPY --from=cert-generator /certs/certificate.pem /job-hub/certificate.pem

RUN yarn install

# Build the app
RUN yarn workspace @job-hub/server build

# Expose the port
EXPOSE 4000

# Start the app
CMD ["yarn", "workspace", "@job-hub/server", "start"]

