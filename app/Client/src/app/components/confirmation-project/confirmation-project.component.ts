import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ProjectServiceGet } from '../../services/project.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-confirmation-project',
  standalone: true,
  imports: [NgToastModule, MatDialogModule, MatCardModule, MatIconModule],
  templateUrl: './confirmation-project.component.html',
  styleUrl: './confirmation-project.component.scss'
})
export class ConfirmationProjectComponent {
  projectId: number = 0;
  constructor(public dialogRef: MatDialogRef<ConfirmationProjectComponent>, private _ngToastService: NgToastService, 
    private projectService: ProjectServiceGet, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit() {
    this.projectId = this.data.projectId;
    console.log(this.projectId);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Assignee deleted successfully", duration: 3000});
  }

  getProjectIdFromRoute(): any{
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
    console.log(this.projectId);
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
