# Use sitespeedio's ubuntu-node as build image
FROM sitespeedio/node:ubuntu-22.04-nodejs-18.18.0 AS build

# Install yarn
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        npm
RUN npm install -g yarn

# Set the working directory in the container
WORKDIR /app

# Copy the entire application code to the container
COPY . .

# Install dependencies
RUN yarn

# Build the static React app for production
RUN yarn build

# Use Nginx as the production reverse proxy
FROM nginx:alpine

# Copy the static built React app to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx proxy
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]