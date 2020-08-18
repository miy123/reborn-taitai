# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /reborn-taitai

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files from host computer to the container
COPY . .

# Build the app
# RUN npm run build

# Specify port app runs on
EXPOSE 80

# Run the app
CMD [ "node", "index.js" ]