import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-add',
  standalone: true,
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss'],
  imports: [ReactiveFormsModule],
})
export class ProjectAddComponent {
  projectForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  private project?: Project;

  constructor(private projectService: ProjectService) {}

  public onSubmit() {
    this.project = {
      id: 0,
      name: this.projectForm.get('name')?.value || '',
      date: new Date(this.projectForm.get('date')?.value || ''),
      description: this.projectForm.get('description')?.value || '',
    };
    alert('kreiran projekat');
    console.log(this.project);
  }
}
