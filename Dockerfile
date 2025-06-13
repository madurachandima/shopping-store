# Use official Node.js image
# FROM node:20

# Set working directory inside the container
# WORKDIR /app

# Copy package.json and package-lock.json first
# COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy the rest of the project files
# COPY . .

# Expose port 3000 (or the port you use in Express)
# EXPOSE 3000

# Start the app using nodemon
# CMD ["npx", "nodemon", "app.js"]
# CMD ["sh", "-c", "sleep 10 && npx nodemon app.js"]

# Use official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Install root SSL certificates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app after a delay to ensure DB is ready
CMD ["sh", "-c", "sleep 10 && npx nodemon app.js"]

