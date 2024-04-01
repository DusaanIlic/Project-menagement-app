import { Component, NgModule, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor, FormsModule, CommonModule, NgToastModule, MatDialogModule, AddTaskComponent],
  templateUrl: './kanban.component.html', 
  styleUrl: './kanban.component.scss',
})

export class KanbanComponent implements OnInit {
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];
  dropList: any[] = ['todo', 'progress', 'done'];

  showToDoList: boolean = true;
  showProgressList: boolean = true;
  showDoneList: boolean = true;

  projectId: string | undefined;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef,  private _ngToastService: NgToastService, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.loadTasksByProject(1);
    this.getProjectIdFromRoute();
  }

  toggleToDoList(){
    this.showToDoList = !this.showToDoList;
  }
  
  toggleProgressList(){
    this.showProgressList = !this.showProgressList;
  }
  
  toggleDoneList(){
    this.showDoneList = !this.showDoneList;
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  drop2(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
        moveItemInArray(this.dropList, event.previousIndex, event.currentIndex);
    } else {
        const movedColumn = this.dropList[event.previousIndex];
        this.dropList.splice(event.previousIndex, 1);
        this.dropList.splice(event.currentIndex, 0, movedColumn);
    }
}

  findTaskIndex(taskId: number, column: string): number {
      let taskList: any[];

      switch (column) {
        case 'todo':
          taskList = this.todo;
          break;
        case 'progress':
          taskList = this.progress;
          break;
        case 'done':
          taskList = this.done;
          break;
        default:
          return -1; 
      }

      const taskIndex = taskList.findIndex(task => task.taskId === taskId);
      return taskIndex;
  }

  deleteTask(column: string, index: number) {    
    if (column === 'todo') {
      this.todo.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'progress') {
      this.progress.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'done') {
      this.done.splice(this.findTaskIndex(index, column), 1);
      this.showMessage();
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    }
  }

  showMessage(){
    this._ngToastService.success({detail: "Success Message", summary: "Deleted successfully", duration: 3000});
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });

    dialogRef.componentInstance.taskAdded.subscribe(() => {
      this.loadTasksByProject(1); // Ponovo učitava zadatke nakon dodavanja novog zadatka
    });
  }

}


