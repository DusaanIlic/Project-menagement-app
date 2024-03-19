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
    projectName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    deadLine: new FormControl('', [Validators.required]),
    projectDescription: new FormControl(''),
  });

  private project?: ProjectAddRequest;

  constructor(private projectService: ProjectService) {}

  public onSubmit() {
    if (this.projectForm.valid) {
      // Obrada podataka
      console.log(this.projectForm.value);
    }
  }
}
