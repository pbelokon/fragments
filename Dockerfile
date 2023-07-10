#In order to build doker images first run Docker desctop then execute docker build -t fragments:latest .
# TODO implement all 9 optimizations
FROM node:18.16.0 AS builder
# for above add digest for sha docker image
LABEL maintainer="Pavel Belokon <pbelokon@example.com>"
LABEL description="Fragments node.js microservice"

WORKDIR /app

COPY package.json package-lock.json ./

# only install production dependancies 
RUN npm ci --only=production

##################################################

FROM node:18.16.0-alpine

# Use /app as our working directory
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Set NODE_ENV to production 
ENV NODE_ENV=production

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

EXPOSE 8080

CMD npm start
