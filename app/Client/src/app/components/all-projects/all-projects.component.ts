import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProjectComponent } from '../add-project/add-project.component';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [CommonModule, RouterLink],
})
export class AllProjectsComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => console.log('Dialog output:', data));
  }

  activeProjectsCount = 0;
  finishedProjectsCount = 0;
  activeProjects: Project[] = [];
  finishedProjects: Project[] = [];
  projects: Project[] = [];
  project: Project = {
    id: 1,
    name: 'Project 1',
    startDate: '123',
    endDate: '321',
    details: 'Details1 ',
    status: 'Active',
    lead: 'Pera Peric',
  };

  project1: Project = {
    id: 1,
    name: 'Project 1',
    startDate: '123',
    endDate: '321',
    details: 'Details1 ',
    status: 'Finished',
    lead: 'Pera',
  };

  ngOnInit(): void {
    this.projects.push(this.project);
    this.projects.push(this.project);
    this.projects.push(this.project);
    this.projects.push(this.project);
    this.projects.push(this.project);
    this.projects.push(this.project);
    this.projects.push(this.project1);
    this.projects.push(this.project1);
    this.projects.push(this.project1);
    this.projects.push(this.project1);
    this.projects.push(this.project1);

    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].status == 'Active')
        this.activeProjects.push(this.projects[i]);
      else this.finishedProjects.push(this.projects[i]);
    }

    this.finishedProjectsCount = this.finishedProjects.length;
    this.activeProjectsCount = this.activeProjects.length;
  }
}
