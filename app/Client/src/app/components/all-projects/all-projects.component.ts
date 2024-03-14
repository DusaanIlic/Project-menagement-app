import { Component, OnInit } from '@angular/core';
import { Project} from "../../models/project";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [CommonModule, RouterLink]
})
export class AllProjectsComponent implements OnInit{


    projects : Project[] = [];
    project : Project = {
        id: 1,
        name: 'Project 1',
        startDate: '123',
        endDate: '321',
        details: 'Details1 ',
        status: 'Active',
        lead: 'Pera',
    };

    ngOnInit(): void {
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);
      this.projects.push(this.project);


    }

    addNewProject()
    {
        console.log("Test");
    }

    openDetails()
    {
        console.log("Open details");
    }



}
