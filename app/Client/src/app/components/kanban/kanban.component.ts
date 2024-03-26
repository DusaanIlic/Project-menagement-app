import { Component, NgModule } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor, FormsModule, CommonModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})

export class KanbanComponent {
  allTasks: any[] = [];
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];

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

  constructor(private taskService: TaskService) {}

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

  deleteTask(column: string, index: number) {
    if (column === 'todo') {
      this.todo.splice(index, 1);
    } else if (column === 'progress') {
      this.progress.splice(index, 1);
    } else if (column === 'done') {
      this.done.splice(index, 1);
    }
  }
}