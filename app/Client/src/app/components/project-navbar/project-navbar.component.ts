import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-project-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './project-navbar.component.html',
  styleUrl: './project-navbar.component.scss'
})
export class ProjectNavbarComponent {

}
