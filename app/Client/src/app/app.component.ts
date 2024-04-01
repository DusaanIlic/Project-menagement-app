import { Component, OnInit } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { AllMembersComponent } from './components/all-members/all-members.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {NgIf} from "@angular/common";
import { initFlowbite } from 'flowbite';
import {ProjectNavbarComponent} from "./components/project-navbar/project-navbar.component";
import { NgxEditorModule } from 'ngx-editor';

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
    ProjectNavbarComponent,
    NgxEditorModule
  ],
})
export class AppComponent implements OnInit{
  showNavbar: boolean = true;
  showProjectNavbar: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        this.showNavbar = url !== '/login';
        this.showProjectNavbar = url.includes('/projects/') && url !== '/projects/all' &&  url !== '/projects/add';
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
