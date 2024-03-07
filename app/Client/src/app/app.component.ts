import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { AllProjectsComponentComponent } from './components/all-projects-component/all-projects-component.component';
import { AllMembersComponentComponent } from './components/all-members-component/all-members-component.component';
import { ProjectAddComponent } from './components/project-add/project-add.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    AllProjectsComponentComponent,
    AllMembersComponentComponent,
    ProjectAddComponent,
    NavbarComponent,
    NgIf,
  ],
})
export class AppComponent {
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/login') {
          this.showNavbar = false;
        }
      }
      if (event instanceof NavigationEnd) {
        if (event.url !== '/login') {
          this.showNavbar = true;
        }
      }
    });
  }
}
