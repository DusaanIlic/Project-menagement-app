import { ChangeDetectorRef, Component } from '@angular/core';
import {CommonModule, NgIf, NgOptimizedImage} from "@angular/common";
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { catchError, map } from 'rxjs/operators';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { TaskOverviewComponent } from '../task-overview/task-overview.component';


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
    FormsModule
  ],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
  showStandalone: boolean = true;
  standaloneTasks: string = '- None';
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  projectId: number = 0;
  allTasks: Task[] = []

  constructor(public dialog: MatDialog,
              private taskService: TaskService,
              private _ngToastService: NgToastService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private tService : TaskService){}

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
      this.loadTasksByProject(this.projectId); // Ponovo učitava zadatke nakon dodavanja novog zadatka
    });
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
          console.log(data)
          this.allTasks = data
          this.todo = data.filter(task => task.taskStatusId === 1).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.progress = data.filter(task => task.taskStatusId === 2).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
          this.done = data.filter(task => task.taskStatusId === 3).sort((a, b) => b.taskPriorityId - a.taskPriorityId);
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
  }

  getProjectIdFromRoute(){
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
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
}
