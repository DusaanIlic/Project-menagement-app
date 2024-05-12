import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgIf, NgOptimizedImage} from "@angular/common";
import {AddTaskComponent} from '../add-task/add-task.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {TaskService} from '../../services/task.service';
import {catchError, map} from 'rxjs/operators';
import {NgToastModule, NgToastService} from 'ng-angular-popup';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../../models/task';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule} from '@angular/forms';
import {TaskOverviewComponent} from '../task-overview/task-overview.component';
import {ProjectServiceGet} from "../../services/project.service";
import {taskCategory} from "../../models/taskCategory";
import {environment} from "../../../environments/environment";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatDivider} from "@angular/material/divider";
import {taskPriority} from "../../models/taskPriority";


@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    MatDialogModule,
    NgToastModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatRadioGroup,
    MatRadioButton,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDivider
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent implements OnInit {
  taskPriorities!: taskPriority[];
  projectId: number = 0;
  allTasks: Task[] = [];
  taskCategories : taskCategory[] = [];

  displayedColumns: string[] = ['taskName', 'startDate', 'deadline', 'taskStatus', 'taskPriorityName','action'];
  dataSource: any;
  @ViewChild(MatSort)sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(public dialog: MatDialog,
              private taskService: TaskService,
              private _ngToastService: NgToastService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private tService : TaskService,
              private pService : ProjectServiceGet, private _liveAnnouncer: LiveAnnouncer){}

  ngOnInit(): void{
    this.getProjectIdFromRoute();
    this.loadTasksByProject(this.projectId);
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });

    dialogRef.componentInstance.taskAdded.subscribe(() => {
      this.loadTasksByProject(this.projectId);
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
          this.allTasks = data
          this.dataSource = new MatTableDataSource(data)
          this.dataSource.paginator = this.paginator
          this.getAllTaskCategoriesOnProject()
        return data;
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          throw error;
        })
      )
      .subscribe(() => {
        this.cdr.detectChanges();
      });

    this.taskService.getTaskPriorities().subscribe({
      next: (data: taskPriority[]) => {
        this.taskPriorities = data;
      },
      error: error => {
        console.log('failed fetching task priorities');
      }
    });
  }

  getProjectIdFromRoute(){
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  search(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDialogOverview(taskId : number)
  {
    const dialogRef = this.dialog.open(TaskOverviewComponent, {
      width: '250px',
      data: taskId
    });
  }

  deleteTask(taskId : number)
  {
    this.tService.deleteTask(taskId).subscribe({
      next : data =>{
        this.loadTasksByProject(this.projectId);
      },
      error : error =>{
        console.log("Error deleting task!")
      }
    });
  }

  hasElement(elem : taskCategory): boolean
  {
    for(let i=0;i<this.taskCategories.length;i++)
    {
      if(this.taskCategories[i].taskCategoryId == elem.taskCategoryId && this.taskCategories[i].taskCategoryName == elem.taskCategoryName)
        return true;
    }
    return false;
  }

  getAllTaskCategoriesOnProject()
  {
    this.pService.getTaskCategoriesOnProject(this.projectId).subscribe((data : taskCategory[]) =>{
     for(let i=0;i<data.length;i++)
     {
       if(!this.hasElement(data[i]))
         this.taskCategories.push(data[i])
     }

    })
  }

  protected readonly environment = environment;
}
