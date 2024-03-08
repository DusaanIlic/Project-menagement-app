import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { AllMembersComponent } from './components/all-members/all-members.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "./components/header/header.component";
import {filter, map} from "rxjs";

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
    HeaderComponent,
  ],
})
export class AppComponent {
  showNavbar: boolean = true;
  showHeader: boolean = true;
  pageTitle: string = 'Default Title';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/login') {
          this.showNavbar = false;
          this.showHeader = false;
        }
      }
      if (event instanceof NavigationEnd) {
        if (event.url !== '/login') {
          this.showNavbar = true;
          this.showHeader = true;
        }
      }
    });
  }
}
