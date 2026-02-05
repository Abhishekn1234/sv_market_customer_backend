# Architecture Overview

This document provides a high-level overview of the SV Marketplace Customer API architecture.

## 🏗 Modular Design

The application follows the standard NestJS modular architecture. The codebase is divided into feature-based modules:

### 1. **Auth Module** (`src/modules/auth`)
-   **Responsibility**: Handles user authentication (Login, Register, Token Management).
-   **Strategies**: Uses `AuthStrategy` and `JwtRefreshStrategy` imported from the shared library (`@faizudheen/shared`) to implement JWT-based protection.
-   **Dependencies**: Depends on `UserModule` to validate and retrieve user details.

### 2. **Booking Module** (`src/modules/booking`)
-   **Responsibility**: Manages the core business logic for service bookings.
-   **Workflow**: Handles booking creation, status updates, and cancellation.
-   **Architecture**: Designed to be extensible, potentially using events for decoupling (configured via `EventEmitterModule`).

### 3. **Services Module** (`src/modules/services`)
-   **Responsibility**: manages the catalog of services available to customers.
-   **Features**: Service listing, details retrieval, and categorization.

### 4. **User Module** (`src/modules/user`)
-   **Responsibility**: Manages user profiles and account data.
-   **Data Access**: Directly interacts with the User database models.

## 💾 Data Layer

-   **Database**: MongoDB is used as the primary data store.
-   **ORM**: [Mongoose](https://mongoosejs.com/) is used for data modeling and interactions.
-   **Connection**: Configured globally in `AppModule` using `MongooseModule`.

## 🔄 Cross-Cutting Concerns

### Shared Library
The project relies on a shared library (`@faizudheen/shared`) for common utilities, likely including:
-   Authentication Strategies
-   Shared DTOs or Interfaces
-   Common Utilities (e.g., Cloudinary integration)

### Configuration
-   Uses `@nestjs/config` for environment variable management.
-   Global validation pipes are configured in `main.ts` to ensure data integrity using `class-validator`.

### Caching & Messaging
-   **Redis**: Configured via `RedisModule` using `ioredis`. Used for caching and potentially for Pub/Sub messaging.
-   **Events**: The application uses `@nestjs/event-emitter` to handle asynchronous events and decouple modules.

## 🌐 External Integrations

-   **Cloudinary**: For image configuration and storage (integrated via shared module).
-   **Redis Cloud**: For remote caching infrastructure.
