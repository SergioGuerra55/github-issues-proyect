import { Component, inject, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { 
  LucideAngularModule, 
  Github, 
  User, 
  Lock, 
  LogIn, 
  UserPlus, 
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-angular';
import { AuthStore } from '@github-issues-manager/auth';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    LucideAngularModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  authStore = inject(AuthStore);

  readonly icons = {
    Github,
    User,
    Lock,
    LogIn,
    UserPlus,
    Mail,
    AlertCircle,
    Loader2,
    CheckCircle
  };

  selectedTab = signal<'login' | 'register'>('login');
  showSuccess = signal(false);

  loginData = signal({
    identifier: '',
    password: ''
  });

  registerData = signal({
    username: '',
    email: '',
    password: ''
  });

  // Validaciones en tiempo real
  loginValidation = signal({
    isValid: false,
    errors: [] as string[]
  });

  registerValidation = signal({
    isValid: false,
    errors: [] as string[]
  });

  constructor() {
    // Validar formulario de login en tiempo real
    effect(() => {
      const data = this.loginData();
      const errors: string[] = [];

      if (data.identifier && data.identifier.length < 3) {
        errors.push('El email/usuario debe tener al menos 3 caracteres');
      }

      if (data.password && data.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }

      this.loginValidation.set({
        isValid: data.identifier.length >= 3 && data.password.length >= 6,
        errors
      });
    });

    // Validar formulario de registro en tiempo real
    effect(() => {
      const data = this.registerData();
      const errors: string[] = [];

      if (data.username && data.username.length < 3) {
        errors.push('El nombre de usuario debe tener al menos 3 caracteres');
      }

      if (data.username && !/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push('Solo se permiten letras, números y guiones bajos en el username');
      }

      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('El email no tiene un formato válido');
      }

      if (data.password && data.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }

      this.registerValidation.set({
        isValid: data.username.length >= 3 && 
                /^[a-zA-Z0-9_]+$/.test(data.username) &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && 
                data.password.length >= 6,
        errors
      });
    });

    // Limpiar mensajes cuando cambias de tab
    effect(() => {
      this.selectedTab(); // Subscribirse al cambio
      this.authStore.clearError();
      this.authStore.clearSuccess();
    });

    // ← AÑADIR ESTE EFFECT PARA DETECTAR LOGIN EXITOSO
    effect(() => {
      const success = this.authStore.success();
      if (success) {
        this.showSuccess.set(true);
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.showSuccess.set(false);
          // Aquí irá la lógica de navegación
          console.log('🎉 Login exitoso! Redirigiendo al dashboard...');
        }, 2000);
      }
    });
  }

  onLogin() {
    if (this.loginValidation().isValid) {
      this.authStore.login(this.loginData());
    }
  }

  onRegister() {
    if (this.registerValidation().isValid) {
      this.authStore.register(this.registerData());
    }
  }

  selectTab(tab: 'login' | 'register') {
    this.selectedTab.set(tab);
  }

  // Métodos para actualizar datos con signals
  updateLoginData(field: 'identifier' | 'password', value: string) {
    this.loginData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  updateRegisterData(field: 'username' | 'email' | 'password', value: string) {
    this.registerData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  // Métodos helper
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(username);
  }

  isRegisterFieldValid(field: 'username' | 'email' | 'password'): boolean {
    const data = this.registerData();
    
    switch (field) {
      case 'username':
        return data.username.length >= 3 && this.isValidUsername(data.username);
      case 'email':
        return this.isValidEmail(data.email);
      case 'password':
        return data.password.length >= 6;
      default:
        return false;
    }
  }

  hasFieldError(field: 'username' | 'email' | 'password'): boolean {
    const data = this.registerData();
    
    switch (field) {
      case 'username':
        return data.username.length > 0 && (data.username.length < 3 || !this.isValidUsername(data.username));
      case 'email':
        return data.email.length > 0 && !this.isValidEmail(data.email);
      case 'password':
        return data.password.length > 0 && data.password.length < 6;
      default:
        return false;
    }
  }
}