import { Component } from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG,
  GanttGlobalConfig,
  GanttItem,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent
} from "@worktile/gantt";

@Component({
  selector: 'app-project-gantt',
  standalone: true,
  imports: [
    NgxGanttComponent,
    NgxGanttTableColumnComponent,
    NgxGanttTableComponent,
  ],
  templateUrl: './project-gantt.component.html',
  styleUrl: './project-gantt.component.scss',
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {

      }
    }
  ]
})
export class ProjectGanttComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197 },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597 }
  ];

  constructor() { }
}
