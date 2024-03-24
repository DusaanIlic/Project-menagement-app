import { Component } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [DragDropModule, NgFor],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})

export class KanbanComponent {
todoTasks: any;
  onDrop(event: CdkDragDrop<string[]>, targetColumn: string) {
    if (event.previousContainer === event.container) {
      const task = event.previousContainer.data[event.previousIndex];
      //task.status = targetColumn;
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, task);
    } 

    
  }

}
