import { Component } from '@angular/core';
import {ProjectNavbarComponent} from "../project-navbar/project-navbar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ProjectNavbarComponent,
    RouterOutlet
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {

}
