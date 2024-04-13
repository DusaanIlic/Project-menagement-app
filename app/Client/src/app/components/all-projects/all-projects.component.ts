import { Component, OnInit } from '@angular/core';
import { Project} from "../../models/project";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectServiceGet } from '../../services/project.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddProjectComponent} from "../add-project/add-project.component";


@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule, MatMenuModule, FormsModule]
})
export class AllProjectsComponent implements OnInit{
  activeProjectsCount = 0;
  finishedProjectsCount = 0;
  allProjects : Project[] = [];
  activeProjects : Project[] = [];
  finishedProjects : Project[] = [];
  selectedTable: string = "t1";

  constructor(private projectService : ProjectServiceGet, private location : Location, private dialog: MatDialog) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => this.fetchProjects());
  }



  fetchProjects() : void
  {
    this.projectService.getAllProjects().subscribe((data : any[]) => {
      console.log(data);
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
        console.log('A:',this.activeProjectsCount);
        console.log('F:',this.finishedProjectsCount);
      }
    });


  }

  deleteProject(id?: number)
  {
    this.projectService.deleteProjectById(id).subscribe(response => {
      console.log(response);
    })
  }

  private mapDataFromDTO(projects : any[]) : Project[]
  {
    return projects.map(item => ({
      id: item.projectId,
      projectName: item.projectName,
      endDate: new Date(item.deadline),
      startDate: new Date(item.startDate),
      description: item.projectDescription,
      details: "",
      status: item.status,
      lead: item.teamLider
    }));
  }




  ngOnInit(): void
  {
    this.fetchProjects();
  }


  clickMethod(name?: string, id?: number, status? : string) {
    if(confirm("Are you sure you want to delete " + name))
    {
      if(status === "In Progress")
        alert("You cannot delete project in progress!");
      else
      {
        if(status == "Closed")
          this.finishedProjectsCount--;
        else
          this.activeProjectsCount--;

        this.deleteProject(id);

        window.location.reload();
      }

    }
  }
}
