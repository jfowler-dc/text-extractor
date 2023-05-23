# Use the official Node.js 14 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Expose the port that the server will be running on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
