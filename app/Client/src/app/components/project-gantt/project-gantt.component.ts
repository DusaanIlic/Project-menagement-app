import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  GANTT_GLOBAL_CONFIG,
  GanttItem,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent
} from "@worktile/gantt";
import {enUS, fr} from "date-fns/locale";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-project-gantt',
  standalone: true,
  imports: [
    NgxGanttComponent,
    NgxGanttTableColumnComponent,
    NgxGanttTableComponent,
    DatePipe,

  ],
  templateUrl: './project-gantt.component.html',
  styleUrl: './project-gantt.component.scss',
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: {
          yearQuarter: `QQQ 'of' yyyy`,
          month: 'LLLL',
          yearMonth: `LLLL yyyy'(week' w ')'`
        }
      }
    }
  ]
})
export class ProjectGanttComponent {
  items: GanttItem[] = [
    { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true },
    { id: '000001', title: 'Task 1', start: 1617361997, end: 1625483597, links: ['000003', '000004', '000000'], expandable: true },
    { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797 },
    { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true }
  ];

  constructor() { }
}
