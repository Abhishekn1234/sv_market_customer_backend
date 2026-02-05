# Contributing to SV Marketplace Customer API

Thank you for your interest in contributing to the SV Marketplace Customer API! We welcome contributions from the team and community.

## 🛠 Development Workflow

1.  **Create a Branch**
    Create a new branch for your feature or bugfix. Use a descriptive name:
    ```bash
    git checkout -b feature/user-profile-update
    # or
    git checkout -b fix/login-validation
    ```

2.  **Make Changes**
    Implement your changes. Ensure you follow the project's coding standards.

3.  **Run Tests**
    Before committing, ensure all tests pass to avoid breaking existing functionality.
    ```bash
    npm run test
    ```

4.  **Commit Changes**
    Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.
    -   `feat: add new booking flow`
    -   `fix: resolve redis connection timeout`
    -   `docs: update API documentation`
    -   `chore: upgrade dependencies`

5.  **Push and Open a Pull Request**
    Push your branch and open a Pull Request (PR) against the `main` or `develop` branch.
    ```bash
    git push origin your-branch-name
    ```

## 📐 Coding Standards

-   **Style**: We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). Run `npm run format` and `npm run lint` before committing.
-   **Structure**: Follow the NestJS module structure. Each feature should have its own module, controller, service, and DTOs.
-   **Naming**:
    -   Classes: `PascalCase` (e.g., `BookingService`)
    -   Files: `kebab-case` (e.g., `booking.service.ts`)
    -   Variables/Functions: `camelCase` (e.g., `createBooking`)

## 📝 Documentation

-   **Swagger**: If you add or modify endpoints, please update the Swagger decorators (`@ApiProperty`, `@ApiOperation`, etc.) to keep the API documentation straightforward.
-   **Comments**: Add comments for complex logic, but aim for self-documenting code.

## 🐛 Reporting Bugs

If you find a bug, please create an issue with:
-   Description of the bug
-   Steps to reproduce
-   Expected behavior
-   Screenshots/Logs (if applicable)

## 🚀 Deployment

Deployment pipelines are triggered via GitHub Actions (or your specific CI/CD tool). Ensure your code builds locally with `npm run build` before pushing.
