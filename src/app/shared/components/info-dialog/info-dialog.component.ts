import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface InfoDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.css'
})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {}
}
