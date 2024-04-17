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

@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule, MatMenuModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,MatRadioModule]
})
export class AllProjectsComponent implements OnInit{
  selectedStatus: string = '';
  activeProjectsCount = 0;
  finishedProjectsCount = 0;
  allProjects : Project[] = [];
  selectedTable: string = "t1";
  displayedColumns: string[] = ['project',  'startDate', 'endDate', 'status', 'manager', /*'details'*/];
  dataSource: any;
  searchTerm: string = '';
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private projectService : ProjectServiceGet, private location : Location, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => this.fetchProjects());
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
      this.allProjects = this.mapDataFromDTO(data);
      this.dataSource = this.allProjects;
      console.log(this.allProjects);
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


  search(): void {
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredProjects = [...this.allProjects];

    if (searchTerm) {
      filteredProjects = filteredProjects.filter(project =>
        project.projectName.toLowerCase().includes(searchTerm)
      );
    }
    else{
      filteredProjects = this.allProjects;
    }

    this.dataSource = filteredProjects;
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
