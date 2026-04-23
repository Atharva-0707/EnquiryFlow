import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Enquiry-Management-System');

  isLoggedIn = signal(false);
  username = signal('');

  login() {
    this.isLoggedIn.set(true);
    this.username.set('User'); // Static username
  }

  logout() {
    this.isLoggedIn.set(false);
    this.username.set('');
  }
}
