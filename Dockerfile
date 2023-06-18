#In order to build doker images first run Docker desctop then execute docker build -t fragments:latest .

# Use node version v18.16.0
FROM node:18.13.0

LABEL maintainer="Pavel Belokon <pbelokon@example.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app


COPY package.json package-lock.json ./

RUN npm install

COPY ./src ./src

EXPOSE 8080

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start
