import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../services/master-service';
import { IDashboardStats } from '../../model/interface/master.Model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private masterService = inject(MasterService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  stats: IDashboardStats | null = null;
  isLoadingStats: boolean = true;
  statsError: boolean = false;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.statsError = false;

    this.masterService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.statsError = true;
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      },
    });
  }
}
