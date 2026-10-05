import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonImports } from '../../Global.constant';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonImports],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  // Tab state: 'signin' or 'signup'
  isSignUp: boolean = false;

  // Login form state
  loginObj: any = {
    username: '',
    password: '',
  };

  // Sign up form state
  registerObj: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    if (this.router.url.includes('register')) {
      this.isSignUp = true;
    }
  }

  setMode(mode: 'signin' | 'signup'): void {
    this.isSignUp = mode === 'signup';
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  fillAdminCredentials(): void {
    this.isSignUp = false;
    this.loginObj.username = 'admin@example.com';
    this.loginObj.password = 'admin123';
    this.errorMessage = '';
  }

  fillEmployeeCredentials(): void {
    this.isSignUp = false;
    this.loginObj.username = 'employee@example.com';
    this.loginObj.password = 'employee123';
    this.errorMessage = '';
  }

  onLogin(): void {
    if (!this.loginObj.username || !this.loginObj.password) {
      this.errorMessage = 'Please enter both email/username and password.';
      this.toastService.warning(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login({
        email: this.loginObj.username,
        username: this.loginObj.username,
        password: this.loginObj.password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const roleLabel = response.user.role === 'admin' ? 'Administrator' : 'Employee';
          this.toastService.success(
            `Welcome back, ${response.user.name} (${roleLabel})!`,
            'Authentication Successful'
          );
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.isLoading = false;
          const msg =
            err.error?.message ||
            (err.status === 0
              ? 'Cannot connect to backend API on port 5001. Please run "npm run dev".'
              : 'Invalid credentials. Please verify your email and password.');
          this.errorMessage = msg;
          this.toastService.error(msg, 'Sign In Failed');
        },
      });
  }

  onRegister(): void {
    if (!this.registerObj.name || !this.registerObj.email || !this.registerObj.password) {
      this.errorMessage = 'Please complete all required fields.';
      this.toastService.warning(this.errorMessage);
      return;
    }

    if (this.registerObj.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      this.toastService.warning(this.errorMessage);
      return;
    }

    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please re-enter.';
      this.toastService.warning(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .register({
        name: this.registerObj.name,
        email: this.registerObj.email,
        password: this.registerObj.password,
        role: this.registerObj.role || 'employee',
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success(
            `Account created successfully! Welcome to EnquiryFlow, ${response.user.name}!`,
            'Registration Successful'
          );
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.isLoading = false;
          const msg =
            err.error?.message ||
            err.error?.errors?.[0] ||
            'Registration failed. Please check the information provided and try again.';
          this.errorMessage = msg;
          this.toastService.error(msg, 'Sign Up Failed');
        },
      });
  }
}
