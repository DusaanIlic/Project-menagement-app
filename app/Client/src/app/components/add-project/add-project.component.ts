import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/add.project.service';
import { ProjectAddRequest } from '../../models/project-add';
import { tap } from 'rxjs/internal/operators/tap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddProjectComponent {
  isSuccess: boolean = false;
  isError: boolean = false;
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    deadLine: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
  });

  private project?: ProjectAddRequest;

  constructor(private projectService: ProjectService) {}

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
