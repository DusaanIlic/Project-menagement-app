import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/add.project.service';
import { ProjectAddRequest } from '../../models/project-add';
import { tap } from 'rxjs/internal/operators/tap';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  isDialogOpen: boolean = false;

  isSuccess: boolean = false;
  isError: boolean = false;
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    deadLine: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
  });

  private project?: ProjectAddRequest;

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    if (
      this.dialogRef.componentInstance.data &&
      this.dialogRef.componentInstance.data.isDialogOpen
    ) {
      this.dialogRef.componentInstance.data.isDialogOpen = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const sanitizedFormValue: ProjectAddRequest = {
        projectName: formValue.projectName || '',
        deadLine: formValue.deadLine ? new Date(formValue.deadLine) : undefined,
        projectDescription: formValue.projectDescription || '',
      };

      this.projectService
        .createProject(sanitizedFormValue)
        .pipe(
          tap({
            next: (response) => {
              // Ako je projekat uspešno dodat
              console.log('Projekat je uspešno dodat', response);
              // poruka na korisničkom interfejsu
              this.showSuccessMessage();
            },
            error: (error) => {
              // Ako se dogodi greška prilikom dodavanja projekta
              console.error('Greška prilikom dodavanja projekta:', error);
              // poruka o grešci na korisničkom interfejsu
              this.showErrorMessage();
            },
          })
        )
        .subscribe();
    }
  }
  showErrorMessage() {
    this.isError = true;
    this.isSuccess = false;
  }
  showSuccessMessage() {
    this.isSuccess = true;
    this.isError = false;
  }
}
