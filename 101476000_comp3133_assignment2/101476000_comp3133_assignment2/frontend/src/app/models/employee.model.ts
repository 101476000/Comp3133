export interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  profilePicture?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface EmployeeResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  profilePicture: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}
