import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, EmployeeResponse } from '../models/employee.model';

const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees($department: String, $position: String) {
    employees(department: $department, position: $position) {
      _id
      firstName
      lastName
      email
      phone
      department
      position
      salary
      joinDate
      profilePicture
      address
      city
      country
    }
  }
`;

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      _id
      firstName
      lastName
      email
      phone
      department
      position
      salary
      joinDate
      profilePicture
      address
      city
      country
    }
  }
`;

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $department: String!
    $position: String!
    $salary: Float!
    $joinDate: String!
    $address: String
    $city: String
    $country: String
    $profilePicture: String
  ) {
    createEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      department: $department
      position: $position
      salary: $salary
      joinDate: $joinDate
      address: $address
      city: $city
      country: $country
      profilePicture: $profilePicture
    ) {
      _id
      firstName
      lastName
      email
      phone
      department
      position
      salary
      joinDate
      profilePicture
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $department: String
    $position: String
    $salary: Float
    $joinDate: String
    $address: String
    $city: String
    $country: String
    $profilePicture: String
  ) {
    updateEmployee(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      department: $department
      position: $position
      salary: $salary
      joinDate: $joinDate
      address: $address
      city: $city
      country: $country
      profilePicture: $profilePicture
    ) {
      _id
      firstName
      lastName
      email
      phone
      department
      position
      salary
      joinDate
      profilePicture
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      _id
      firstName
      lastName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(
    department?: string,
    position?: string,
  ): Observable<EmployeeResponse[]> {
    return this.apollo
      .query<{ employees: EmployeeResponse[] }>({
        query: GET_ALL_EMPLOYEES,
        variables: {
          ...(department && { department }),
          ...(position && { position }),
        },
      })
      .pipe(map((result) => result.data.employees));
  }

  getEmployee(id: string): Observable<EmployeeResponse> {
    return this.apollo
      .query<{ employee: EmployeeResponse }>({
        query: GET_EMPLOYEE,
        variables: { id },
      })
      .pipe(map((result) => result.data.employee));
  }

  createEmployee(employee: Employee): Observable<EmployeeResponse> {
    return this.apollo
      .mutate<{ createEmployee: EmployeeResponse }>({
        mutation: CREATE_EMPLOYEE,
        variables: employee,
        refetchQueries: [
          {
            query: GET_ALL_EMPLOYEES,
          },
        ],
      })
      .pipe(map((result) => result.data!.createEmployee));
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<EmployeeResponse> {
    return this.apollo
      .mutate<{ updateEmployee: EmployeeResponse }>({
        mutation: UPDATE_EMPLOYEE,
        variables: { id, ...employee },
        refetchQueries: [
          {
            query: GET_ALL_EMPLOYEES,
          },
        ],
      })
      .pipe(map((result) => result.data!.updateEmployee));
  }

  deleteEmployee(id: string): Observable<EmployeeResponse> {
    return this.apollo
      .mutate<{ deleteEmployee: EmployeeResponse }>({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        refetchQueries: [
          {
            query: GET_ALL_EMPLOYEES,
          },
        ],
      })
      .pipe(map((result) => result.data!.deleteEmployee));
  }

  getDepartments(): string[] {
    return [
      'Engineering',
      'Marketing',
      'Sales',
      'HR',
      'Finance',
      'Operations',
      'Support',
    ];
  }

  getPositions(): string[] {
    return [
      'Junior Developer',
      'Senior Developer',
      'Manager',
      'Director',
      'Coordinator',
      'Specialist',
      'Intern',
    ];
  }
}
