import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Enquiry-Management-System';

  router = inject(Router);

  get isLoggedIn(): boolean {
    return localStorage.getItem('enquiryApp') !== null;
  }

  get username(): string {
    return localStorage.getItem('enquiryApp') ?? '';
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    localStorage.removeItem('enquiryApp');
    this.router.navigateByUrl('/login');
  }
}
