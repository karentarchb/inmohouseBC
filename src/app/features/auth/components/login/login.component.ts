import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.services';
import { Credentials } from '../../models/credentials.interface';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../../../shared/components/info-dialog/info-dialog.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  public isLoading = signal<boolean>(false);
  public loginError = signal<string | null>(null);
  public hidePassword = signal<boolean>(true);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  ngOnInit(): void {
    /**
     * Al iniciar el componente, revisa si hay un email guardado
     * en localStorage para autocompletar el campo.
     */
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
  }

  /**
   * Intenta autenticar al usuario y redirige en caso de éxito.
   */
  login(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.loginError.set(null);
    const credentials = this.loginForm.getRawValue() as Credentials;

    if (this.loginForm.value.rememberMe) {
      localStorage.setItem('remembered_email', this.loginForm.value.email ?? '');
    } else {
      localStorage.removeItem('remembered_email');
    }

    this.authService.login(credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (err) => this.loginError.set(err.message || 'Ocurrió un error desconocido.')
      });
  }

  openForgotPasswordDialog(): void {
    this.dialog.open(InfoDialogComponent, {
      width: '400px',
      data: {
        title: 'Funcionalidad en Desarrollo',
        message: 'Lo sentimos, en este momento no podemos colaborarte por este medio. <br><br> Por favor, para recuperar tu contraseña envía un correo a: <strong>soporte@inmohouse.com</strong>'
      }
    });
  }
}
