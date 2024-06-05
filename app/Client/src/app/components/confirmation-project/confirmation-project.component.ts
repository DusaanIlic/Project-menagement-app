import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ProjectServiceGet } from '../../services/project.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-confirmation-project',
  standalone: true,
  imports: [NgToastModule, MatDialogModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './confirmation-project.component.html',
  styleUrl: './confirmation-project.component.scss'
})
export class ConfirmationProjectComponent {
  projectId: number = 0;
  constructor(public dialogRef: MatDialogRef<ConfirmationProjectComponent>, private snackBar: MatSnackBar,
    private projectService: ProjectServiceGet, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any){}

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this.snackBar.open('Assignee deleted successfully.', 'Close', { duration: 3000 });
  }

  confirmDelete(): void {
    this.projectService.deleteProjectById(this.projectId).subscribe(
      () => {
        this.showMessage();
        this.dialogRef.close();
      },
      error => {
        console.error('Error deleting project:', error);
        // Dodajte odgovarajući tretman greške
      }
    );
  }
}
