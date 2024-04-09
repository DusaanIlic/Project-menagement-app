import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";

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
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log('Project id is: ', params['id']);
    })
  }
}
