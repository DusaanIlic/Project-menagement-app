import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from "@angular/router";


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
  projectId: any;

  constructor(private router: ActivatedRoute, private activated: ActivatedRoute) {
    this.router.params.subscribe(params => {
      this.projectId = params['id'];
      console.log(`Project id: ${this.projectId}`);
    })
  }
}
