# Heartistry Backend User/Auth API

This repository contains the backend API for the **Heartistry** web application, built using **NestJS**. The backend provides essential services for managing users, email verification, authentication, and logging.

## Features

The backend offers the following core functionalities:

- **User Management**: Store and manage user information securely.
- **JWT Authentication**: Generate and validate JSON Web Tokens (JWT) for user authentication.
- **Email Verification**:
  - Store OTP (One-Time Passwords) for email verification.
  - Send verification emails via Google Mail (Gmail) integration.
- **Audit Logging**: Track system activities and save audit logs for better monitoring and debugging.

## Related Projects

This backend is part of the **Heartistry** application. You can find the related repositories here:

- [Heartistry Frontend](https://github.com/votranphi/heartistry): The web-based user interface, built with React and Vite.
- [Heartistry Backend User/Auth API (this repo)](https://github.com/votranphi/heartistry-user-api): The backend API built with NestJS that handles authentication, email verification, and user management.
- [Heartistry Backend Task API](https://github.com/votranphi/heartistry-task-api): A Spring Boot service that manages tasks and metrics.

The Heartistry application is designed for users to create, manage, and learn from custom vocabulary Wordsets via Flashcards. Check out the main frontend repository to explore how this backend integrates with the user interface.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: For type safety and modern JavaScript features.
- **PostgreSQL**: For storing user data, OTPs, and audit logs.
- **JWT**: For secure authentication.
- **Nodemailer**: To send emails via Google Mail.

## Prerequisites

Make sure you have the following installed:

- **Node.js**: v16.x or later
- **npm**: v8.x or later
- **PostgreSQL**: Running instance of your preferred database
- **Gmail Account**: For sending emails

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/votranphi/heartistry-user-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd heartistry-user-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root of the project.
   - Add the following configuration (update the values as needed):
     ```env
      # Mail Configuration
      MAIL_HOST=<mail-host>
      MAIL_USER=<mail-address>
      MAIL_PASSWORD=<mail-app-password>
      MAIL_FROM=<mail-from>

      # Database Configuration
      DB_TYPE=<database-type>
      DB_HOST=<database-ip>
      DB_PORT=<database-port>
      DB_USERNAME=<database-username>
      DB_PASSWORD=<database-password>
      DB_DATABASE=<database-name>

      # JWT Token Configuration
      JWT_SECRET=<jwt-secret>
      TOKEN_EXPIRE_TIME=<token-expire-time>

      # Config the server's port
      SERVER_PORT=3030
     ```
5. Start the application:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3030`.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push the changes:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the [Apache License 2.0](LICENSE). See the `LICENSE` file for details.

## Credits
Contributors:
- Vo Tran Phi (Student ID: 22521081)  
Github link: [votranphi](https://github.com/votranphi) 
- Le Duong Minh Phuc (Student ID: 22521116)  
Github link: [minhphuc2544](https://github.com/minhphuc2544)