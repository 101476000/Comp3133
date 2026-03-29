import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeResponse } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="employee-list-container">
      <div class="list-header">
        <h1>Employees</h1>
        <a routerLink="/dashboard/add" class="btn-add-employee">+ Add New Employee</a>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Department</label>
          <select [(ngModel)]="selectedDepartment" (change)="onFilterChange()" class="filter-select">
            <option value="">All Departments</option>
            <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Position</label>
          <select [(ngModel)]="selectedPosition" (change)="onFilterChange()" class="filter-select">
            <option value="">All Positions</option>
            <option *ngFor="let pos of positions" [value]="pos">{{ pos }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Search</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (keyup)="onSearchChange()"
            placeholder="Search by name or email..."
            class="filter-input"
          />
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Loading employees...</p>
      </div>

      <div class="error" *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>

      <div class="table-responsive" *ngIf="!isLoading && filteredEmployees.length > 0">
        <table class="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let employee of filteredEmployees" class="employee-row">
              <td class="name-cell">
                <div class="employee-info">
                  <img 
                    [src]="employee.profilePicture || 'https://via.placeholder.com/40'" 
                    alt="Profile"
                    class="employee-avatar"
                  />
                  <div>
                    <div class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</div>
                  </div>
                </div>
              </td>
              <td>{{ employee.email }}</td>
              <td><span class="badge badge-department">{{ employee.department }}</span></td>
              <td>{{ employee.position }}</td>
              <td class="salary">{{ employee.salary | currency }}</td>
              <td>{{ employee.joinDate | date: 'MMM dd, yyyy' }}</td>
              <td class="actions">
                <button class="btn-view" (click)="viewDetails(employee)">View</button>
                <a [routerLink]="['/dashboard/edit', employee._id]" class="btn-edit">Edit</a>
                <button class="btn-delete" (click)="deleteEmployee(employee._id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredEmployees.length === 0">
        <p>No employees found. {{ selectedDepartment || selectedPosition ? 'Try changing your filters.' : 'Start by adding a new employee.' }}</p>
      </div>

      <!-- Details Modal -->
      <div class="modal-overlay" *ngIf="selectedEmployee" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Employee Details</h2>
            <button class="btn-close" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="details-grid">
              <div class="detail-item">
                <label>First Name</label>
                <p>{{ selectedEmployee.firstName }}</p>
              </div>
              <div class="detail-item">
                <label>Last Name</label>
                <p>{{ selectedEmployee.lastName }}</p>
              </div>
              <div class="detail-item">
                <label>Email</label>
                <p>{{ selectedEmployee.email }}</p>
              </div>
              <div class="detail-item">
                <label>Phone</label>
                <p>{{ selectedEmployee.phone }}</p>
              </div>
              <div class="detail-item">
                <label>Department</label>
                <p>{{ selectedEmployee.department }}</p>
              </div>
              <div class="detail-item">
                <label>Position</label>
                <p>{{ selectedEmployee.position }}</p>
              </div>
              <div class="detail-item">
                <label>Salary</label>
                <p>{{ selectedEmployee.salary | currency }}</p>
              </div>
              <div class="detail-item">
                <label>Join Date</label>
                <p>{{ selectedEmployee.joinDate | date: 'MMM dd, yyyy' }}</p>
              </div>
              <div class="detail-item" *ngIf="selectedEmployee.address">
                <label>Address</label>
                <p>{{ selectedEmployee.address }}</p>
              </div>
              <div class="detail-item" *ngIf="selectedEmployee.city">
                <label>City</label>
                <p>{{ selectedEmployee.city }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a [routerLink]="['/dashboard/edit', selectedEmployee._id]" class="btn-edit" (click)="closeModal()">Edit</a>
            <button class="btn-secondary" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-list-container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .list-header h1 {
      margin: 0;
      color: #333;
    }

    .btn-add-employee {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-add-employee:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .filters-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .filter-select,
    .filter-input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .loading,
    .empty-state,
    .error {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .error {
      background: #fee;
      color: #c33;
      border-radius: 4px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .employees-table {
      width: 100%;
      border-collapse: collapse;
    }

    .employees-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #eee;
    }

    .employees-table th {
      padding: 15px;
      text-align: left;
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }

    .employees-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    .employee-row:hover {
      background: #f8f9fa;
    }

    .name-cell {
      font-weight: 500;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .employee-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .employee-name {
      color: #333;
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-department {
      background: #e3f2fd;
      color: #1976d2;
    }

    .salary {
      font-weight: 600;
      color: #667eea;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-view,
    .btn-edit,
    .btn-delete,
    .btn-secondary {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-view {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-view:hover {
      background: #1976d2;
      color: white;
    }

    .btn-edit {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .btn-edit:hover {
      background: #7b1fa2;
      color: white;
    }

    .btn-delete {
      background: #ffebee;
      color: #c62828;
    }

    .btn-delete:hover {
      background: #c62828;
      color: white;
    }

    .btn-secondary {
      background: #eee;
      color: #333;
    }

    .btn-secondary:hover {
      background: #ddd;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #666;
    }

    .modal-body {
      padding: 20px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .detail-item label {
      display: block;
      color: #666;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .detail-item p {
      color: #333;
      margin: 0;
    }

    .modal-footer {
      padding: 20px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        gap: 15px;
      }

      .filters-section {
        grid-template-columns: 1fr;
      }

      .employees-table {
        font-size: 12px;
      }

      .employees-table th,
      .employees-table td {
        padding: 10px;
      }

      .actions {
        flex-direction: column;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  employees: EmployeeResponse[] = [];
  filteredEmployees: EmployeeResponse[] = [];
  departments: string[] = [];
  positions: string[] = [];
  selectedDepartment = '';
  selectedPosition = '';
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  selectedEmployee: EmployeeResponse | null = null;

  ngOnInit(): void {
    this.loadEmployees();
    this.departments = this.employeeService.getDepartments();
    this.positions = this.employeeService.getPositions();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load employees. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredEmployees = this.employees.filter((employee) => {
      const matchDepartment =
        !this.selectedDepartment ||
        employee.department === this.selectedDepartment;
      const matchPosition =
        !this.selectedPosition ||
        employee.position === this.selectedPosition;
      const matchSearch =
        !this.searchTerm ||
        employee.firstName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.lastName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchDepartment && matchPosition && matchSearch;
    });
  }

  viewDetails(employee: EmployeeResponse): void {
    this.selectedEmployee = employee;
  }

  closeModal(): void {
    this.selectedEmployee = null;
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: () => {
          this.errorMessage = 'Failed to delete employee. Please try again.';
        },
      });
    }
  }
}
