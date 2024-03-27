import { Component, NgModule } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor, FormsModule, CommonModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})

export class KanbanComponent {
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];
  dropList: any[] = ['todo', 'progress', 'done'];

  showToDoList: boolean = true;
  showProgressList: boolean = true;
  showDoneList: boolean = true;

  toggleToDoList(){
    this.showToDoList = !this.showToDoList;
  }

  toggleProgressList(){
    this.showProgressList = !this.showProgressList;
  }

  toggleDoneList(){
    this.showDoneList = !this.showDoneList;
  }

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void{
    this.loadTasksByProject(1);
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

  deleteTask(column: string, index: number) {    
    if (column === 'todo') {
      this.todo.splice(index, 1);
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'progress') {
      this.progress.splice(index, 1);
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    } else if (column === 'done') {
      this.done.splice(index, 1);
      this.taskService.deleteTask(index).subscribe(
        (error) => console.log("error", error)
      );
    }
  }

  printProgress(){
    console.log(this.progress);
  }
}