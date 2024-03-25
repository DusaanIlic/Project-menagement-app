import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})

export class KanbanComponent {
  allTasks: any[] = [];
  todo: any[] = [];
  progress: any[] = [];
  done: any[] = [];


  constructor(private taskService: TaskService) {}

  ngOnInit(): void{
    this.loadTasksByProject(1);
  }

  loadTasksByProject(projectId: number): void {
    this.taskService.getTasksByProject(projectId)
      .pipe(
        map((data: any[]) => {
          this.todo = data.filter(task => task.taskStatusId === 1);
          this.progress = data.filter(task => task.taskStatusId === 3);
          this.done = data.filter(task => task.taskStatusId === 4);
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