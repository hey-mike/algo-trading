# Use a specific version of the Node.js image that matches your development environment.
FROM node:18

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY package*.json ./

# Install all dependencies including 'devDependencies' since they are needed for local development.
RUN npm install

# If you have native dependencies, use 'npm rebuild' here to ensure the binaries are built for the correct architecture.

# Copy the source code of your service to the container.
COPY . .

# Run the TypeScript compiler to build the project.
RUN npm run build

# Expose the port that your service listens on.
EXPOSE 6000

# Use the "start" script as defined in your package.json to run the service.
CMD ["npm", "run", "start"]
