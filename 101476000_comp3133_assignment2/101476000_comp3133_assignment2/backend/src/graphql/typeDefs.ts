import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: String
    createdAt: String!
    updatedAt: String!
  }

  type Employee {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    department: String!
    position: String!
    salary: Float!
    joinDate: String!
    profilePicture: String
    address: String
    city: String
    country: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Query {
    # Auth
    currentUser: User
    
    # Employees
    employees(department: String, position: String): [Employee!]!
    employee(id: ID!): Employee
    searchEmployees(query: String!): [Employee!]!
  }

  type Mutation {
    # Auth
    login(email: String!, password: String!): AuthResponse!
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): AuthResponse!
    logout: Boolean!

    # Employees
    createEmployee(
      firstName: String!
      lastName: String!
      email: String!
      phone: String!
      department: String!
      position: String!
      salary: Float!
      joinDate: String!
      address: String
      city: String
      country: String
      profilePicture: String
    ): Employee!

    updateEmployee(
      id: ID!
      firstName: String
      lastName: String
      email: String
      phone: String
      department: String
      position: String
      salary: Float
      joinDate: String
      address: String
      city: String
      country: String
      profilePicture: String
    ): Employee!

    deleteEmployee(id: ID!): Employee!
  }

  type Subscription {
    employeeAdded: Employee!
    employeeUpdated: Employee!
    employeeDeleted: String!
  }
`;
