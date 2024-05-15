import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {RouterLink} from "@angular/router";
import {Project} from "../../models/project";
import {ProjectServiceGet} from "../../services/project.service";
import {AuthService} from "../../services/auth.service";
import {data} from "autoprefixer";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";
import { FormsModule } from '@angular/forms';
import { ProjectStatus } from '../../models/project-status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatTable,
    MatHeaderRow,
    MatHeaderRowDef,
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    MatHeaderCellDef,
    MatMenuTrigger,
    RouterLink,
    MatSort,
    MatRow,
    MatRowDef,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatPaginator
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  projects!: Project[];
  dataSource: any;
  tasks!: Task[];

  selectedStatus: number = 0;
  defaultStatus: number = 0;

  searchProjects: string = '';
  searchTasks: string = '';
  projectStatuses !: ProjectStatus[];
  
  memberId!: any;

  projectSource: any;
  projectColumns: string[] = ['projectName', 'startDate', 'deadline', 'projectPriority', 'status', 'actions'];

  taskSource: any;
  taskColumns: string[] = ['taskName', 'startDate', 'deadline', 'taskPriorityName', 'taskStatus', 'actions'];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(private authService: AuthService, private _liveAnnouncer: LiveAnnouncer,
                private projectService: ProjectServiceGet, private taskService: TaskService) { }
   
  onStatusChange(event: any) {
      this.selectedStatus = event;
      this.projectSource.data = this.projects.filter(project => this.selectedStatus == 0 || project.projectStatusId == this.selectedStatus);
  }

  ngOnInit(): void {
    this.memberId = this.authService.getAuthenticatedMembersId();

    this.projectService.getAllProjectsWhereMemberIsAssigned(this.memberId).subscribe({
      next: data=> {
        this.projects = data;
        this.projectSource = new MatTableDataSource(this.projects);
        this.projectSource.sort = this.sort.toArray()[0];
        this.projectSource.paginator = this.paginator.toArray()[1];
      },
      error: error => {
        console.log('failed fetching project data');
      }
    });

    this.taskService.getTasksByMember(this.memberId).subscribe({
      next: data => {
        this.tasks = data;
        this.taskSource = new MatTableDataSource(this.tasks);
        this.taskSource.sort = this.sort.toArray()[1];
        this.taskSource.paginator = this.paginator.toArray()[1];
      },
      error: error => {
        console.log('failed fetching task data');
      }
    });

    this.projectService.getAllProjectStatuses().subscribe({
      next: (data: ProjectStatus[]) => {
        this.projectStatuses = data;
      },
      error: error => {
        console.log('failed fetching project statuses');
      }
    })
  }
  
  searchProj(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectSource.filter = filterValue.trim().toLowerCase();
  }

  

  searchTas(): void {
    let searchTerm = this.searchTasks.toLowerCase().trim();
    let filteredTasks = [...this.tasks];

    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.taskName.toLowerCase().includes(searchTerm)
      );
    }
    else{
      filteredTasks = this.tasks;
    }
    this.taskSource = filteredTasks;
  }

  protected readonly data = data;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
