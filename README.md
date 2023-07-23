# Conquerer Blog

## Introduction

The Conquerer Blog project aims to provide a blogging platform where users can create accounts, publish blog posts, and interact with other users through comments.
## Technologies Used

- **Express.js**: Express is used as the web application framework for handling API requests, routing, and middleware management.
- **PostgreSQL**: PostgreSQL is used as the database management system to store and retrieve blog data.
- **Redis**:  Redis is used for JWT token management to enhance security and improve performance.
- **Postman**: Postman is used to generate API documentation, which can be accessed at [Conquerer API Collection](https://documenter.getpostman.com/view/12702657/2s946maA68).
- **TypeDI**: TypeDI is used for dependency injection to manage services and controllers.
- **Routing-Controllers**: Routing-Controllers is used for managing API endpoints and handling requests.
- **Compression**: Compression middleware is used to enhance the performance of the application by compressing the response data.
- **Helmet**: Helmet middleware is used to enhance the security of the application by setting various HTTP headers.
- **Interceptor**: Custom interceptors are implemented to handle custom responses and perform additional actions before and after request processing.
- **Filters**: Custom filters are used to catch and handle exceptions globally in the application.
- **Pagination**: Pagination is implemented to efficiently handle large data sets and improve performance.
- **Indexing and Data Type Selection**: Proper indexing and careful selection of data types are done to enhance database performance.
- **Docker**: Docker is used to containerize the application and create a portable development and deployment environment.


## Key Considerations

During the development of the project, the following key considerations were taken into account:

- **Code Readability and Maintainability**: The codebase is structured to be easily readable, following best practices and coding standards, to ensure maintainability in the long run.
- **Dependency Injection**: TypeDI is used for dependency injection to manage services and controllers effectively.
- **Middleware Usage**: Middleware libraries such as Compression and Helmet are utilized to enhance performance and security.
- **Interceptor and Filters**: Custom interceptors and filters are used for handling custom responses, as well as catching and handling exceptions globally.
- **Pagination for Listing**: Pagination is implemented in the listing endpoints to handle large data sets efficiently.
- **Database Performance**: Indexing and proper data type selection are done to optimize database performance.
- **Redis Caching**: Redis is used for caching responses, reducing response times and improving API performance.
- **Docker Containers**: The application is containerized using Docker, enabling easy deployment and scalability.

## Project Setup

### Prerequisites

To run the project,if you don't use docker, make sure you have the following prerequisites installed:

- Node.js and npm
- PostgreSQL database
- Redis server

### Installation(If you dont use docker)

1. Clone the repository:

   ```shell
   git clone https://github.com/your_username/conquerer-blog.git
2. Install the dependencies:

   ```shell
   npm install
3. Configure environment variables:

   Rename the .env.sample file to .env.
   Fill in the necessary environment variables in the .env file.
4. Start the application:
     ```shell
    npm install
5. Generate test data:
      ```shell
    npm run seed

### Installation(If you use use docker):
If you prefer to use Docker for the project, follow these additional steps:

1. Complete the necessary environment setup, including the .env file.

2. Build and start the containers(Please wait for the container to start for second step):
    ```shell
    docker-compose up -d
3. Generate seed data for testing:
    ```shell
    docker-compose exec api npm run seed
