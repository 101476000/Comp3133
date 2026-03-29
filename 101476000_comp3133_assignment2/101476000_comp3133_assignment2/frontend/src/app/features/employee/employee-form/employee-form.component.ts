import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-card">
        <div class="form-header">
          <h1>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>
          <p>{{ isEditMode ? 'Update employee information' : 'Fill in the details below' }}</p>
        </div>

        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="employee-form">
          <div class="form-section">
            <h3>Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  placeholder="Enter first name"
                  class="form-control"
                  [class.error]="isFieldInvalid('firstName')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('firstName')">
                  First name is required
                </span>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  placeholder="Enter last name"
                  class="form-control"
                  [class.error]="isFieldInvalid('lastName')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('lastName')">
                  Last name is required
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  placeholder="Enter email"
                  class="form-control"
                  [class.error]="isFieldInvalid('email')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('email')">
                  Please enter a valid email
                </span>
              </div>

              <div class="form-group">
                <label for="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  placeholder="Enter phone number"
                  class="form-control"
                  [class.error]="isFieldInvalid('phone')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('phone')">
                  Phone is required
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="address">Address</label>
                <input
                  type="text"
                  id="address"
                  formControlName="address"
                  placeholder="Enter address"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input
                  type="text"
                  id="city"
                  formControlName="city"
                  placeholder="Enter city"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="country">Country</label>
                <input
                  type="text"
                  id="country"
                  formControlName="country"
                  placeholder="Enter country"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Job Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="department">Department *</label>
                <select
                  id="department"
                  formControlName="department"
                  class="form-control"
                  [class.error]="isFieldInvalid('department')"
                >
                  <option value="">Select Department</option>
                  <option *ngFor="let dept of departments" [value]="dept">
                    {{ dept }}
                  </option>
                </select>
                <span class="error-message" *ngIf="isFieldInvalid('department')">
                  Department is required
                </span>
              </div>

              <div class="form-group">
                <label for="position">Position *</label>
                <select
                  id="position"
                  formControlName="position"
                  class="form-control"
                  [class.error]="isFieldInvalid('position')"
                >
                  <option value="">Select Position</option>
                  <option *ngFor="let pos of positions" [value]="pos">
                    {{ pos }}
                  </option>
                </select>
                <span class="error-message" *ngIf="isFieldInvalid('position')">
                  Position is required
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="salary">Salary *</label>
                <input
                  type="number"
                  id="salary"
                  formControlName="salary"
                  placeholder="Enter salary"
                  class="form-control"
                  [class.error]="isFieldInvalid('salary')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('salary')">
                  Salary is required
                </span>
              </div>

              <div class="form-group">
                <label for="joinDate">Join Date *</label>
                <input
                  type="date"
                  id="joinDate"
                  formControlName="joinDate"
                  class="form-control"
                  [class.error]="isFieldInvalid('joinDate')"
                />
                <span class="error-message" *ngIf="isFieldInvalid('joinDate')">
                  Join date is required
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="profilePicture">Profile Picture URL</label>
              <input
                type="url"
                id="profilePicture"
                formControlName="profilePicture"
                placeholder="Enter profile picture URL"
                class="form-control"
              />
              <small>Enter a valid image URL or leave blank for default avatar</small>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!employeeForm.valid || isLoading">
              {{ isLoading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee' }}
            </button>
            <a routerLink="/dashboard" class="btn-secondary">Cancel</a>
          </div>

          <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
          <p class="success-message" *ngIf="successMessage">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .form-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .form-header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
    }

    .form-header p {
      margin: 0;
      color: #666;
    }

    .form-section {
      margin-bottom: 30px;
    }

    .form-section h3 {
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    small {
      color: #999;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-control {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }

    .success-message {
      color: #27ae60;
      font-size: 14px;
      margin-top: 15px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn-primary,
    .btn-secondary {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #eee;
      color: #333;
    }

    .btn-secondary:hover {
      background: #ddd;
    }

    @media (max-width: 600px) {
      .form-card {
        padding: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `],
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  departments: string[] = [];
  positions: string[] = [];

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.departments = this.employeeService.getDepartments();
    this.positions = this.employeeService.getPositions();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = params['id'];
        this.loadEmployee(params['id']);
      }
    });
  }

  private initializeForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      salary: [0, [Validators.required, Validators.min(0)]],
      joinDate: ['', [Validators.required]],
      address: [''],
      city: [''],
      country: [''],
      profilePicture: [''],
    });
  }

  private loadEmployee(id: string): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          joinDate: this.formatDate(employee.joinDate),
          address: employee.address,
          city: employee.city,
          country: employee.country,
          profilePicture: employee.profilePicture,
        });
      },
      error: () => {
        this.errorMessage = 'Failed to load employee data.';
      },
    });
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe({
        next: () => {
          this.successMessage = 'Employee updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.message || 'Failed to update employee.';
        },
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: () => {
          this.successMessage = 'Employee added successfully!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.message || 'Failed to add employee.';
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
