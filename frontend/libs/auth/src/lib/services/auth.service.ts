import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) {}

  /**
   * Iniciar sesión
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/local`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/local/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verificar si el email ya existe
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/users?filters[email][$eq]=${email}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verificar si el username ya existe
   */
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/users?filters[username][$eq]=${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener información del usuario actual
   */
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  /**
   * Cerrar sesión (solo limpia el token del localStorage)
   */
  logout(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Guardar token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error?.error) {
      const strapiError = error.error.error;
      
      // Errores específicos de Strapi
      switch (strapiError.message) {
        case 'Email or Username are already taken':
          errorMessage = 'El email o nombre de usuario ya están en uso';
          break;
        case 'Invalid identifier or password':
          errorMessage = 'Email/usuario o contraseña incorrectos';
          break;
        case 'Your account email is not confirmed':
          errorMessage = 'Debes confirmar tu email antes de iniciar sesión';
          break;
        case 'Your account has been blocked by an administrator':
          errorMessage = 'Tu cuenta ha sido bloqueada por un administrador';
          break;
        default:
          errorMessage = strapiError.message || errorMessage;
      }
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica que Strapi esté funcionando.';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos. Verifica la información ingresada.';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
    }

    return throwError(() => ({ ...error, message: errorMessage }));
  }
}