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
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AddTaskStatusComponent } from '../add-task-status/add-task-status.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor, FormsModule, CommonModule, NgToastModule, MatDialogModule, AddTaskComponent, AddTaskStatusComponent],
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

      const taskId = event.item.data.taskId;
      const statusId = this.getStatusIdFromColumnName(event.container.id);
      const column = event.container.id; 
      this.taskService.updateTaskStatus(taskId, statusId, column).subscribe(() => {
        console.log('Task status updated successfully.');
      }, error => {
        console.error('Error updating task status:', error);
      });
    }
}
  getStatusIdFromColumnName(columnName: string): number {
    switch (columnName) {
      case 'todo':
        return 1;
      case 'progress':
        return 2;
      case 'done':
        return 3;
      default:
        return -1;
    }
  }

  updateTaskStatus(taskId: number, previousColumn: string, currentColumn: string) {
    let statusId: number;

    switch (currentColumn) {
        case 'todo':
            statusId = 1;
            break;
        case 'progress':
            statusId = 2;
            break;
        case 'done':
            statusId = 3;
            break;
        default:
            return; 
    }

    // Pozivamo servis da ažurira status zadatka
    this.taskService.updateTaskStatus(taskId, statusId, currentColumn)
        .subscribe(
            () => console.log('Task status updated successfully.'),
            error => console.error('Error updating task status:', error)
        );
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
      this.loadTasksByProject(1); 
    });
  }

  openConfirmationDialog(column: string, index: number): void{
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: { column, index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteTask(result.column, result.index);
      }
    });
  }

  openTaskStatusDialog(){
    const dialogRef = this.dialog.open(AddTaskStatusComponent, {
      width: '500px',
      data: { projectId: this.projectId}
    });


  }

}


