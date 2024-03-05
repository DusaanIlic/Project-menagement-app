import { Component } from '@angular/core';
import { Project } from '../../project';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  project: Project = 
  {
    Id: 1,
    Name: 'Project 1',
    DateStarts: 123,
    DateEnds: 321,
    Details: 'Detrails..',
    Status: 'Active',
    Lead: 'Pera'
  }
}
