# Employee Management System – COMP3133 Assignment 2

An Angular-based Employee Management System with a GraphQL backend that provides authentication, employee CRUD operations, search and filtering, and a responsive user interface.

## Project Information

**Course:** Full Stack Development II (COMP3133)  
**Assignment:** Assignment 2  
**Student ID:** 101476000

## Overview

This project is a full-stack Employee Management System built with Angular on the frontend and Node.js, Express, GraphQL, and MongoDB on the backend. It allows authenticated users to manage employee records through a clean and responsive interface.

The application includes user authentication, employee creation and management, employee search and filtering, and route protection using JWT-based session handling.

## Main Features

### Authentication
- User signup with form validation
- User login with email and password
- JWT-based authentication
- Protected routes using Angular route guards
- Persistent session handling with tokens stored in local storage

### Employee Management
- View all employees in a structured table
- Add new employee records
- Edit employee details
- Delete employees with confirmation
- View employee details

### Search and Filtering
- Search employees by name or email
- Filter employees by department
- Filter employees by position
- Real-time filtering support

### User Interface
- Responsive layout for desktop, tablet, and mobile devices
- Clean and professional design
- Form validation feedback
- Smooth navigation between authentication and dashboard pages

## Technology Stack

### Frontend
- Angular 17
- TypeScript
- Reactive Forms
- Apollo Angular Client

### Backend
- Node.js
- Express.js
- Apollo GraphQL Server
- MongoDB

### Authentication and Security
- JWT
- bcryptjs

### Deployment and DevOps
- Docker
- Docker Compose
- Vercel

## Project Structure

```text
101476000_comp3133_assignment2/
├── docker-compose.yml
├── .gitignore
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts
│   │   │   │   └── interceptors/
│   │   │   │       └── auth.interceptor.ts
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── signup/
│   │   │   │   ├── dashboard/
│   │   │   │   └── employee/
│   │   │   │       ├── employee-list/
│   │   │   │       └── employee-form/
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   └── employee.model.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       └── employee.service.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.scss
│   ├── package.json
│   ├── tsconfig.json
│   ├── angular.json
│   ├── vercel.json
│   └── Dockerfile
└── backend/
    ├── src/
    │   ├── graphql/
    │   │   ├── typeDefs.ts
    │   │   └── resolvers.ts
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    ├── Dockerfile
    └── .env.example

---

**Last Updated**: March 2024
**Version**: 1.0.0
