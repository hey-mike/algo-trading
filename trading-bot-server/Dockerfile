# Use the official Node.js image with a version that matches your development environment.
FROM node:18

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy the source code of your service to the container.
COPY . .

# Compile TypeScript to JavaScript.
RUN npm run build

# Expose the port that your service listens on.
EXPOSE 5000

# Use the "start" script as defined in your package.json to run the compiled service.
CMD ["npm", "run", "start"]
