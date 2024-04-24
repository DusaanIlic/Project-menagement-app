import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    NgForOf,
    MatIcon,
    MatSidenavContent,
    RouterLink,
    MatDivider,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projectId: any;

  buttons = [
    { link: 'overview', text: 'Overview', icon: 'my_library_books' },
    { link: 'assignees', text: 'Assigness', icon: 'assignment_ind' },
    { link: 'tasks', text: 'Tasks', icon: 'task_alt' },
    { link: 'gantt', text: 'Gantt', icon: 'waterfall_chart' },
    { link: 'kanban', text: 'Kanban', icon: 'view_kanban' },
    { link: 'analytics', text: 'Analytics', icon: 'analytics' },
  ];

  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.projectId = params['id'];
      console.log(`Project id: ${this.projectId}`);
    })
  }
}
