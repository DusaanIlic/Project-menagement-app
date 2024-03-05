import { Component } from '@angular/core';
import { Project } from '../models/project';

@Component({
  selector: 'app-add-project-component',
  standalone: true,
  imports: [],
  templateUrl: './add-project-component.component.html',
  styleUrl: './add-project-component.component.scss'
})
export class AddProjectComponentComponent {
  project: Project =
  {
    Id: 1,
    Name: 'Project 1',
    DateStarts: 123,
    DateEnds: 321,
    Details: 'Details details',
    Status: 'Active',
    Lead: 'Pera Peric'
  }

  ngOnInit(): void
  {
    this.fetchData();
  }

  fetchData()
  {
    console.log(this.project);
  }
}
