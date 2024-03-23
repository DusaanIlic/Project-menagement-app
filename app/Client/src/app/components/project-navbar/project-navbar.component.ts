import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-project-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './project-navbar.component.html',
  styleUrl: './project-navbar.component.scss'
})
export class ProjectNavbarComponent {

}
