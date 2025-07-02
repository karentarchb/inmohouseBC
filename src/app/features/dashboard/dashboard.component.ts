import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../auth/services/auth.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
  * Llama al método de logout del servicio y redirige al login.
  */
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
