# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# If you're using yarn, you can copy yarn.lock and run `yarn install` instead:
# COPY package.json yarn.lock ./
# RUN yarn install

# Copy the rest of your app's source code
COPY . .

# Make port 3000 available to the world outside this container
# This is the default port that Create React App uses
EXPOSE 3000

# Run the app in development mode
# This command will use the react-scripts package installed in your project
CMD ["npm", "start"]
