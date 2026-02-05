<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# SV Marketplace Customer API

This is the customer-facing API for the SV Marketplace platform, built with [NestJS](https://nestjs.com/). It handles user authentication, service browsing, booking management, and user profile operations.

## 🚀 Features

-   **Authentication**: Secure JWT-based authentication.
-   **User Management**: User profile handling.
-   **Services**: Browse and search for available services.
-   **Bookings**: specialized booking workflows with event-driven architecture.
-   **Media**: Cloudinary integration for image management.
-   **Real-time**: Redis-based caching and potentially real-time features.

## 🛠 Tech Stack

-   **Framework**: [NestJS 11](https://nestjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Caching/Queue**: [Redis](https://redis.io/)
-   **Cloud Storage**: Cloudinary
-   **Language**: TypeScript

## 📋 Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A MongoDB instance (local or Atlas)
-   A Redis instance
-   Cloudinary Account

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd sv_marketplace_customer_api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=3000
    MONGO_DB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
    JWT_SECRET=your_jwt_secret_key
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Redis Configuration
    REDIS_URL=redis://<user>:<password>@<host>:<port>

    # Other
    GITHUB_TOKEN=your_github_token
    ```

## ▶️ Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## 📖 API Documentation

The application uses **Swagger** for API documentation.

Once the application is running, verify the documentation at:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This provides an interactive interface to test the endpoints locally.

## 🧪 Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 📂 Project Structure

```
src/
├── modules/
│   ├── auth/       # Authentication logic (Login, Register, JWT)
│   ├── booking/    # Booking management and workflows
│   ├── services/   # Service catalog and listings
│   └── user/       # User profile management
├── app.module.ts   # Main application module
├── main.ts         # Application entry point
└── redis.module.ts # Redis configuration
```

## 🤝 Contributing

We welcome contributions! Please check the [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## 🏗 Architecture

For a deeper dive into the system's design and modules, read our [Architecture Overview](docs/ARCHITECTURE.md).

## 📄 License

This project is [UNLICENSED](LICENSE).
