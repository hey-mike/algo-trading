# Use the official Node.js 14 image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle your app's source code inside the Docker image
COPY . .

# If your service uses a build step, you can run it here. E.g.:
# RUN npm run build

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 5000

# Define the command to run your app using CMD which defines your runtime
# Here we will use node command
CMD [ "node", "src/index.js" ]
