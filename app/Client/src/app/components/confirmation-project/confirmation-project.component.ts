import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectServiceGet } from '../../services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-project.component.html',
  styleUrl: './confirmation-project.component.scss',
  standalone: true,
  imports:[MatDialogModule, MatButtonModule, MatButton, CommonModule, RouterLink]
})
export class ConfirmationProjectComponent {
  projectId: number = 0;
  constructor(public dialogRef: MatDialogRef<ConfirmationProjectComponent>,
    private projectService: ProjectServiceGet, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar){}

  ngOnInit() {
    this.projectId = this.data.projectId;
  }
  


  confirmDelete(): void {
    this.projectService.deleteProjectById(this.projectId).subscribe(
      () => {
        this.snackBar.open('Project deleted successfully.', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close();
      },
      error => {
        console.error('Error deleting project:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}