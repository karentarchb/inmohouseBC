import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { Property } from '../../models/property.interface';
import { Observable } from 'rxjs';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../auth/models/user.interface';

@Component({
  selector: 'app-property-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './property-form-dialog.component.html',
  styleUrl: './property-form-dialog.component.css',
})
export class PropertyFormDialogComponent implements OnInit {
  propertyForm: FormGroup;
  isEditMode: boolean;
  agents$: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<PropertyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { property?: Property }
  ) {
    this.isEditMode = !!data.property;

    this.propertyForm = this.fb.group({
      title: [data.property?.title || '', Validators.required],
      description: [data.property?.description || '', Validators.required],
      price: [data.property?.price || '', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      address: [data.property?.address || '', Validators.required],
      city: [data.property?.city || '', Validators.required],
      type: [data.property?.type || '', Validators.required],
      agent_id: [data.property?.agent_id || null, Validators.required]
    });
    this.agents$ = this.userService.getAgents();
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.propertyForm.invalid) {
      return;
    }
    this.dialogRef.close(this.propertyForm.value);
  }
}
