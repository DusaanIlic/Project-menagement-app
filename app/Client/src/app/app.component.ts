import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { AllMembersComponent } from './components/all-members/all-members.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    AllProjectsComponent,
    AllMembersComponent,
    AddProjectComponent,
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
