# Fullstack-template

## Introduction

This is a fullstack template for web applications. It is built with the following technologies:

- Frontend: React
- Styling: Tailwind CSS
- Backend: Python FastAPI
- Database: Postgres (Can easily be swapped out for any other databases)
- Deployment: Docker / Docker Compose
- CI/CD: Github Actions
- Commit Linting: Pre-commit

## Getting Started

### Prerequisites

NOTE: It is highly recommended that you have Docker and Docker Compose installed on your machine. If not, you can download Docker Desktop from [here](https://www.docker.com/products/docker-desktop).

This set-up enables developers to run the application in a containerized environment, which is consistent across different machines. This is especially useful when working in a team. Developers can run the application without having to install any dependencies on their local machine. It also supports hot-reloading, so any changes made to the code will be reflected in the application in real-time.

It is also important to know that it is not necessary to have Docker installed to run the application. The application can be run locally without Docker, but it is not recommended.

### Installation

To run the application in development mode, run the following command in the root directory of the project:

```
docker-compose up --build
```

To run the application in production mode, run the following command in the root directory of the project:

```
docker-compose -f docker-compose.prod.yml up --build
```
