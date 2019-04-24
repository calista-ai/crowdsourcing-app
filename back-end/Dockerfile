# Install node image in container
FROM node:11.10.1

# Install nodemon for hot reloading
RUN npm install -g nodemon

# Create and set the working directory
RUN mkdir -p /app/server
WORKDIR /app/server

# Copy the dependency files to the container
COPY package*.json /app/server/

# Install dependencies
RUN npm install

# Copy the server files to the container
COPY . /app/server/

# Run the server
CMD ["npm", "run", "watch"]
