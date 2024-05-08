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
import {ProjectStatus} from "../../models/project-status";

@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule, MatMenuModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatRadioModule, MatLabel, MatFormField, MatInput, MatIcon, MatSelect, MatOption, NgToastModule]
})
export class AllProjectsComponent implements OnInit{
  selectedStatus: number = 0;
  activeProjectsCount = 0;
  finishedProjectsCount = 0;
  allProjects : Project[] = [];
  displayedColumns: string[] = ['project',  'startDate', 'deadline', 'priority', 'status', 'manager', 'actions'];
  projectStatuses !: ProjectStatus[];
  dataSource: any;
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private projectService : ProjectServiceGet, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {}

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


  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onStatusChange(event: any) {
    this.selectedStatus = event;
    console.log(this.selectedStatus);

    this.dataSource.data = this.allProjects.filter(project => this.selectedStatus == 0 || project.projectStatusId == this.selectedStatus);
  }

  ngOnInit(): void
  {
    this.fetchProjects();

    this.projectService.getAllProjectStatuses().subscribe({
      next: (data: ProjectStatus[]) => {
        this.projectStatuses = data;
      },
      error: error => {
        console.log('failed fetching project statuses');
      }
    })
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
