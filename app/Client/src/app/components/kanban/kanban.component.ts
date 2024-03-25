import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDropListGroup, NgFor],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})

export class KanbanComponent {
  todo = ['Figma prototip', 'Gantt', 'Kanban', 'Members'];

  progress = ['Tabela', 'Projekti', 'Taskovi', 'Analitika'];

  done = ['Dashboard', 'Login', 'Register', 'UserProfil'];

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
