import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.scss'
})
export class ProjectAddComponent {
  name = new FormControl('');
  date = new FormControl('');
  description = new FormControl('');

  public onClick(){
    console.log
  }
}
