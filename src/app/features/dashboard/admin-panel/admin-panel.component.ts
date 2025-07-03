import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormDialogComponent } from '../../users/components/user-form-dialog/user-form-dialog.component';
import { UserService } from '../../users/services/user.service';
import { User } from '../../auth/models/user.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  public dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) this.dataSource.sort = sort;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const operation$ = user?.id
          ? this.userService.updateUser(user.id, result)
          : this.userService.createUser(result);

        operation$.subscribe(() => {
          this.loadUsers();
          this.snackBar.open(`Usuario ${user?.id ? 'actualizado' : 'creado'} con éxito`, 'Cerrar', { duration: 3000 });
        });
      }
    });
  }

  deleteUser(id: number, name: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }
}
