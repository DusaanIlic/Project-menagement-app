import { Component, OnInit } from '@angular/core';
import { ProjectComponent } from "../../models/project/project.component";
import { Project } from '../../project';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [ProjectComponent, CommonModule]
})
export class AllProjectsComponent implements OnInit{
    

    projects : Project[] = [];
    project : Project = {
        Id: 1,
        Name: 'Project 1',
        DateStarts: 123,
        DateEnds: 321,
        Details: 'Details1 ',
        Status: 'Active',
        Lead: 'Pera'
    };

    ngOnInit(): void {
        this.projects.push(this.project);
        this.projects.push(this.project);
        this.projects.push(this.project);
    }



}
