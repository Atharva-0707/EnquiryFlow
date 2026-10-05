import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ToastService, ToastMessage } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = 'Enquiry-Management-System';
  isMobileMenuOpen: boolean = false;

  private router = inject(Router);
  public authService = inject(AuthService);
  public toastService = inject(ToastService);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get username(): string {
    return this.authService.username;
  }

  get role(): string {
    return this.authService.role;
  }

  login(): void {
    this.router.navigateByUrl('/login');
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('You have been logged out of the workspace.', 'Signed Out');
  }

  closeToast(id: number): void {
    this.toastService.remove(id);
  }
}
