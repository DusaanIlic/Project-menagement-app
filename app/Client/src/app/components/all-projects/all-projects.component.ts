import { Component, OnInit, ViewChild } from '@angular/core';
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
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgToastModule} from "ng-angular-popup";

@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule, MatMenuModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatRadioModule, MatLabel, MatFormField, MatInput, MatIcon, MatSelect, MatOption, NgToastModule]
})
export class AllProjectsComponent implements OnInit{
  selectedStatus: string = '';
  activeProjectsCount = 0;
  finishedProjectsCount = 0;
  allProjects : Project[] = [];
  selectedTable: string = "t1";
  displayedColumns: string[] = ['project',  'startDate', 'deadline', 'priority', 'status', 'manager', 'actions'];
  dataSource: any;
  searchTerm: string = '';
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private projectService : ProjectServiceGet, private location : Location, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {}

  openDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '35%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((data) => this.fetchProjects());
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterProjects(this.selectedStatus);
  }

  filterProjects(status: string): void {
    if (status === 'allProjects') {
      this.dataSource = this.allProjects;
    } else if (status == 'finishedProjects') {
      this.dataSource = this.allProjects.filter(project => project.status === 'Closed');
    }
    else{
      this.dataSource = this.allProjects.filter(project => project.status === 'In Progress' || project.status === 'In Preparation');
    }
  }


  /*filterProjects() {
    switch (this.selectedStatus) {
      case 'activeProjects':
        return this.allProjects.filter(project => project.status === 'in progress' || project.status === 'in preparation');
      case 'finishedProjects':
        return this.allProjects.filter(project => project.status === 'closed');
      default:
        return this.allProjects;
    }
  }*/

  fetchProjects() : void
  {
    this.projectService.getAllProjects().subscribe((data : any[]) => {
      console.log(data);
      this.allProjects = data;
      this.dataSource = new MatTableDataSource(this.allProjects);
      this.dataSource.paginator = this.paginator;
      console.log(this.allProjects);
    });


  }

  deleteProject(id?: number)
  {
    this.projectService.deleteProjectById(id).subscribe(response => {
      console.log(response);
    })
  }

  // private mapDataFromDTO(projects : any[]) : Project[]
  // {
  //   return projects.map(item => ({
  //     projectId: item.projectId,
  //     projectName: item.projectName,
  //     deadline: new Date(item.deadline),
  //     startDate: new Date(item.startDate),
  //     projectDescription: item.projectDescription,
  //     details: "",
  //     status: item.status,
  //     teamLeader: item.teamLider
  //   }));
  // }


  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue);
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
