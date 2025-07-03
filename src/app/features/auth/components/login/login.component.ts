import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  pulsePhase: number;
}

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
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
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

  mounted = signal(false);

  canvasWidth = 0;
  canvasHeight = 0;
  particles: Particle[] = [];
  animationId: number = 0;
  ctx: CanvasRenderingContext2D | null = null;

  private colors = [
    'rgba(96, 165, 250, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(251, 191, 36, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(6, 182, 212, 0.8)',
  ];

  ngOnInit(): void {
    this.setupCanvas();
    this.initializeParticles();
    this.startAnimation();
    setTimeout(() => {
      this.mounted.set(true);
    }, 100);
    window.addEventListener('resize', this.handleResize.bind(this));

    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Intenta autenticar al usuario y redirige en caso de éxito.
   */
  login(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.loginError.set(null);
    const credentials = this.loginForm.getRawValue() as Credentials;

    this.createSubmitExplosion();

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

  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.updateCanvasSize();
  }

  private updateCanvasSize() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;

    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
  }

  private handleResize() {
    this.updateCanvasSize();
    this.redistributeParticles();
  }

  private initializeParticles() {
    this.particles = [];
    const particleCount = Math.min(80, Math.floor((this.canvasWidth * this.canvasHeight) / 8000));

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(i));
    }
  }

  private createParticle(id: number): Particle {
    return {
      id,
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      targetX: Math.random() * this.canvasWidth,
      targetY: Math.random() * this.canvasHeight,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.02 + 0.01,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      pulsePhase: Math.random() * Math.PI * 2
    };
  }

  private redistributeParticles() {
    this.particles.forEach(particle => {
      particle.targetX = Math.random() * this.canvasWidth;
      particle.targetY = Math.random() * this.canvasHeight;
    });
  }

  private startAnimation() {
    const animate = () => {
      this.updateParticles();
      this.drawParticles();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updateParticles() {
    const time = Date.now() * 0.001;

    this.particles.forEach(particle => {

      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;

      particle.x += dx * particle.speed;
      particle.y += dy * particle.speed;

      particle.pulsePhase += 0.02;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        particle.targetX = Math.random() * this.canvasWidth;
        particle.targetY = Math.random() * this.canvasHeight;
      }

      if (particle.x < 0 || particle.x > this.canvasWidth) {
        particle.targetX = Math.random() * this.canvasWidth;
      }
      if (particle.y < 0 || particle.y > this.canvasHeight) {
        particle.targetY = Math.random() * this.canvasHeight;
      }
    });
  }

  private drawParticles() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.particles.forEach(particle => {
      const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulsePhase));
      const pulseSize = particle.size * (0.8 + 0.4 * Math.sin(particle.pulsePhase * 0.7));

      this.ctx!.save();
      this.ctx!.globalAlpha = pulseOpacity;
      this.ctx!.fillStyle = particle.color;
      this.ctx!.shadowBlur = 10;
      this.ctx!.shadowColor = particle.color;
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
      this.ctx!.fill();

      this.ctx!.restore();
    });

    this.drawConnections();
  }

  private drawConnections() {
    if (!this.ctx) return;

    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];

        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;

          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
          this.ctx.lineWidth = 1;

          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.stroke();

          this.ctx.restore();
        }
      }
    }
  }

  private createSubmitExplosion() {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const distance = Math.random() * 200 + 100;

      const explosionParticle: Particle = {
        id: Date.now() + i + 1000,
        x: centerX,
        y: centerY,
        targetX: centerX + Math.cos(angle) * distance,
        targetY: centerY + Math.sin(angle) * distance,
        size: Math.random() * 5 + 3,
        opacity: 1,
        speed: 0.08,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        pulsePhase: 0
      };

      this.particles.push(explosionParticle);
    }
  }
}
