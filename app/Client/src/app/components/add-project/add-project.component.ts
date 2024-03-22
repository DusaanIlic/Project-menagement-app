import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/add.project.service';
import { ProjectAddRequest } from '../../models/project-add';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [ReactiveFormsModule],
})
export class AddProjectComponent {
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
      // Convert string value to Date object for deadLine
      const sanitizedFormValue: ProjectAddRequest = {
        projectName: formValue.projectName || '',
        // Ensure deadLine is a Date object
        deadLine: formValue.deadLine ? new Date(formValue.deadLine) : undefined,
        projectDescription: formValue.projectDescription || '',
      };

      // Obrada podataka
      console.log(sanitizedFormValue);
      this.projectService.createProject(sanitizedFormValue);
    }
  }
}
