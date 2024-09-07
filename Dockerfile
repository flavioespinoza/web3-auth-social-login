# Use the official Ubuntu runtime as the base image
FROM ubuntu:22.04 as base

# Use the official Node.js runtime as the build image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN yarn build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]