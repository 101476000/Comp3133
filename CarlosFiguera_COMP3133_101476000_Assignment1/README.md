# COMP3133 Assignment 1 (101476000) — Employee Management System (Backend)

Backend API built with NodeJS, Express, Apollo GraphQL, MongoDB, JWT, and Cloudinary.

## Requirements Covered
- Mutation: Signup
- Query: Login
- Query: Get all employees
- Mutation: Add new employee (uploads profile picture to Cloudinary)
- Query: Search employee by eid
- Mutation: Update employee by eid
- Mutation: Delete employee by eid
- Query: Search employee by designation or department

## Local Setup
1) Install dependencies
```bash
npm install
```

2) Create `.env` from `.env.example` and fill values:
- `MONGODB_URI`
- `DB_NAME` (recommended: `comp3133_101476000_assigment1`)
- `JWT_SECRET`
- Cloudinary variables

3) Run
```bash
npm run dev
```
GraphQL endpoint: `http://localhost:4000/graphql`

## Deploy to Vercel
1) Push this repository to GitHub.
2) In Vercel: New Project → Import Git Repository.
3) Add Environment Variables (same keys as `.env.example`).
4) Deploy.

After deployment:
- GraphQL endpoint will be: `https://<your-vercel-domain>/graphql`

## Auth (JWT)
Signup and Login are public.
All employee operations require `Authorization: Bearer <token>`.

## Using Cloudinary (employee_photo)
For `addNewEmployee` and optional photo update, send `employee_photo` as a Data URI (Base64), e.g.:
`data:image/png;base64,iVBORw0K...`

## Sample User (for testing login)
Create one using the `signup` mutation.
Example:
- username: `carlos`
- email: `carlos@example.com`
- password: `Password123`

## Postman
A Postman collection with ready-to-run GraphQL requests is included in `postman/`.
