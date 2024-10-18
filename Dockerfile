# Use the ubuntu/bind9 image as the base
FROM ubuntu/bind9:latest

# Set working directory for Next.js app
WORKDIR /app

# Install Node.js (for running Next.js) and other dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Next.js package files and install dependencies
# COPY SRC DST
COPY webapp/package*.json ./
RUN npm install

# Copy Next.js app source code
COPY ./webapp .

# Build the Next.js app
RUN npm run build

# Expose ports for Bind9 (53 for DNS) and Next.js (3000 for web)
EXPOSE 3000 53 53/udp

# Start both services: Bind9 and Next.js
CMD service bind9 start && npm run start
