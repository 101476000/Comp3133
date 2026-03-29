import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="navbar-content">
          <div class="navbar-brand">
            <h2>Employee Management</h2>
          </div>
          <ul class="nav-links">
            <li><a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Employees</a></li>
            <li><a routerLink="/dashboard/add">Add Employee</a></li>
          </ul>
          <div class="user-section">
            <span class="user-name" *ngIf="currentUser">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>
        </div>
      </nav>

      <main class="dashboard-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f7fa;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .navbar-brand h2 {
      color: white;
      margin: 0;
      font-size: 22px;
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 30px;
      margin: 0;
      padding: 0;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      padding: 8px 12px;
      border-radius: 4px;
    }

    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.3);
      border-bottom: 2px solid white;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 15px;
      color: white;
    }

    .user-name {
      font-weight: 500;
    }

    .btn-logout {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: white;
      color: #667eea;
    }

    .dashboard-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 30px 20px;
    }

    @media (max-width: 768px) {
      .navbar-content {
        flex-direction: column;
        gap: 10px;
        height: auto;
        padding: 15px 20px;
      }

      .nav-links {
        gap: 15px;
        flex-wrap: wrap;
      }

      .user-section {
        width: 100%;
        justify-content: space-between;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
