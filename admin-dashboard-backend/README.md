# Admin Dashboard Backend

The Admin Dashboard Backend is part of the SOIL Organic project, serving as the central server-side component that handles data management and serves GraphQL APIs to support administrative operations for product, user, and review management.

## Features

- **User Management**: Create, block, and unblock users, along with fetching user details.
- **Product Management**: Add, edit, and delete products, including stock and engagement metrics.
- **Review Management**: Manage product reviews and their visibility.
- **Real-time Metrics**: Polling services for real-time updates on product engagement, stock and recent reviews.
- **GraphQL API**: A flexible and efficient GraphQL API endpoint for interacting with the frontend.

## Technology Stack

- **Node.js**: JavaScript runtime for building fast, scalable network applications.
- **Express.js**: Minimalist web framework for Node.js.
- **Apollo Server**: GraphQL server that provides a robust set of features to integrate GraphQL into your app.
- **Sequelize**: Promise-based Node.js ORM for MySQL.
- **GraphQL**: A query language for your API, and a server-side runtime for executing queries using a type system you define for your data.
- **WebSocket**: Real-time communication protocols.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Access to a PostgreSQL database

### Installation

1. Clone the repository:
   git clone https://github.com/rmit-fsd-2024-s1/s3977487-s3987749-a2.git

2. Navigate into the project directory
    cd admin-dashboard-backend

3. Install dependencies:
    npm install

4. Configure the database settings in src/config/config.js according to your environment.

### Running the Server

1. Start the server
    npm start
This command will start the HTTP server and the GraphQL interface.

### Environment Variables

Ensure the following environment variables are set in your config.js file:
    DB_HOST: Database host
    DB_USER: Database user
    DB_PASS: Database password
    DB_NAME: Database name

### Directory Structure

- src/: Source files for the backend application.
- config/: Configuration files including database and server settings.
- database/: Database initialization and model definitions.
- graphql/: GraphQL schema definitions and resolvers.
- models/: Sequelize models for ORM.
- services/: Background services such as polling mechanisms.
- app.js: Main application setup with Apollo Server.
- server.js: Entry point for the application.
- package.json: Project metadata and dependencies.