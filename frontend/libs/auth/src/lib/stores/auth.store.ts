import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthState, LoginCredentials, RegisterData } from '../models/auth.model';

interface ExtendedAuthState extends AuthState {
  success: string | null;
}

const initialState: ExtendedAuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  success: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    /**
     * Iniciar sesión
     */
    login: rxMethod<LoginCredentials>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        switchMap((credentials) => {
          // Validaciones del lado del cliente
          if (!credentials.identifier.trim()) {
            patchState(store, { 
              error: 'El email o nombre de usuario es requerido', 
              isLoading: false 
            });
            return EMPTY;
          }
          
          if (!credentials.password.trim()) {
            patchState(store, { 
              error: 'La contraseña es requerida', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (credentials.password.length < 6) {
            patchState(store, { 
              error: 'La contraseña debe tener al menos 6 caracteres', 
              isLoading: false 
            });
            return EMPTY;
          }

          return authService.login(credentials).pipe(
            tap((response) => {
              authService.saveToken(response.jwt);
              patchState(store, { 
                user: response.user, 
                token: response.jwt,
                isLoading: false,
                success: `¡Bienvenido de vuelta, ${response.user.username}!`
              });
            }),
            catchError((error) => {
              patchState(store, { 
                error: error.message || 'Error al iniciar sesión', 
                isLoading: false 
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    /**
     * Registrar usuario
     */
    register: rxMethod<RegisterData>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        switchMap((userData) => {
          // Validaciones del lado del cliente
          if (!userData.username.trim()) {
            patchState(store, { 
              error: 'El nombre de usuario es requerido', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (userData.username.length < 3) {
            patchState(store, { 
              error: 'El nombre de usuario debe tener al menos 3 caracteres', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
            patchState(store, { 
              error: 'El nombre de usuario solo puede contener letras, números y guiones bajos', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (!userData.email.trim()) {
            patchState(store, { 
              error: 'El email es requerido', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            patchState(store, { 
              error: 'Por favor ingresa un email válido', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (!userData.password.trim()) {
            patchState(store, { 
              error: 'La contraseña es requerida', 
              isLoading: false 
            });
            return EMPTY;
          }

          if (userData.password.length < 6) {
            patchState(store, { 
              error: 'La contraseña debe tener al menos 6 caracteres', 
              isLoading: false 
            });
            return EMPTY;
          }

          return authService.register(userData).pipe(
            tap((response) => {
              authService.saveToken(response.jwt);
              patchState(store, { 
                user: response.user, 
                token: response.jwt,
                isLoading: false,
                success: `¡Cuenta creada exitosamente! Bienvenido, ${response.user.username}!`
              });
            }),
            catchError((error) => {
              patchState(store, { 
                error: error.message || 'Error al registrarse', 
                isLoading: false 
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    /**
     * Cerrar sesión
     */
    logout(): void {
      authService.logout();
      patchState(store, initialState);
    },

    /**
     * Limpiar errores
     */
    clearError(): void {
      patchState(store, { error: null });
    },

    /**
     * Limpiar mensajes de éxito
     */
    clearSuccess(): void {
      patchState(store, { success: null });
    }
  }))
);