import { Component } from '@angular/core';
import {CommonModule, NgIf, NgOptimizedImage} from "@angular/common";
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { catchError, map } from 'rxjs/operators';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task';


@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    MatDialogModule,
    NgToastModule,
    CommonModule
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

  constructor(public dialog: MatDialog,
              private taskService: TaskService,
              private _ngToastService: NgToastService,
              private route: ActivatedRoute){}

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
        map((data: Task[]) => {
          console.log("Tasts: " + data)
          this.todo = data.filter(task => task.taskStatusId === 1);
          this.progress = data.filter(task => task.taskStatusId === 2);
          this.done = data.filter(task => task.taskStatusId === 3);
          return data;
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          throw error; 
        })
      )
      .subscribe();
  }

  getProjectIdFromRoute(){
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Task added successfully", duration: 3000});
  }
}
