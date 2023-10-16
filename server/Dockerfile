# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the backend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Express app is running on (e.g., 5555)
EXPOSE 5555

# Start your Express application
CMD ["npm", "start"]
