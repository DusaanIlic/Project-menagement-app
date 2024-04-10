import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import { routes } from '../../app.routes';

@Component({
  selector: 'app-project-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './project-navbar.component.html',
  styleUrl: './project-navbar.component.scss'
})
export class ProjectNavbarComponent {

  projectId: number = 2;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log('Project id is: ', params['id']);
    })
  }
}
