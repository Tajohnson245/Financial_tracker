FROM node:20.15.0

RUN addgroup --system <group>
RUN adduser --system <user> --ingroup <group>
USER <user>:<group>


WORKDIR /app

# Copy only the package files first to leverage Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose the development server port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
