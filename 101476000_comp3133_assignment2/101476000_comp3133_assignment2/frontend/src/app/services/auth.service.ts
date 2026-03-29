import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, SignupRequest } from '../models/auth.model';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private tokenKey = 'auth_token';

  constructor(private apollo: Apollo) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.validateToken();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apollo
      .mutate<{ login: AuthResponse }>({
        mutation: LOGIN_MUTATION,
        variables: credentials,
      })
      .pipe(
        map((result) => result.data!.login),
        tap((response) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
      );
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    const { confirmPassword, ...signupData } = data;
    return this.apollo
      .mutate<{ signup: AuthResponse }>({
        mutation: SIGNUP_MUTATION,
        variables: signupData,
      })
      .pipe(
        map((result) => result.data!.signup),
        tap((response) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
      );
  }

  logout(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private validateToken(): void {
    this.apollo
      .query<{ currentUser: User }>({
        query: CURRENT_USER_QUERY,
      })
      .subscribe({
        next: (result) => {
          this.currentUserSubject.next(result.data.currentUser);
        },
        error: () => {
          this.logout();
        },
      });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
