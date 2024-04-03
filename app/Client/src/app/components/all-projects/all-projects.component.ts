import { Component, OnInit, inject } from '@angular/core';
import { Project} from "../../models/project";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../services/add.project.service';
import { map } from 'rxjs';
import { ProjectServiceGet } from '../../services/project.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [CommonModule, RouterLink, MatButtonModule, MatMenuModule]
})
export class AllProjectsComponent implements OnInit{


    activeProjectsCount = 0;
    finishedProjectsCount = 0;
    allProjects : Project[] = [];
    activeProjects : Project[] = [];
    finishedProjects : Project[] = [];

    constructor(private projectService : ProjectServiceGet) {}


    fetchProjects() : void
    {
        this.projectService.getAllProjects().subscribe((data : any[]) => {
            this.allProjects = this.mapDataFromDTO(data);
            console.log(this.allProjects);
            let i = 0;
        while(this.allProjects[i] != undefined)
        {
            if(this.allProjects[i].status === "Closed")
            {
                this.finishedProjectsCount++;
                this.finishedProjects.push(this.allProjects[i]);
            }
                
            else
            {
                this.activeProjectsCount++;
                this.activeProjects.push(this.allProjects[i]);
            }
            i++;
        }
        });
    }

    private mapDataFromDTO(projects : any[]) : Project[]
    {
        return projects.map(item => ({
            id: item.projectId,
            name: item.projectName,
            endDate: new Date(item.deadline),
            startDate: new Date(item.startDate),
            description: item.projectDescription,
            details: "",
            status: item.status,
            lead: item.teamLead,
        }));
    }

    


    ngOnInit(): void
    {
        this.fetchProjects();
        
    }

}
