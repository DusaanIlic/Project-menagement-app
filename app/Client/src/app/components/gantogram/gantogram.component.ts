import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  GanttChartComponent,
  GanttChartModule,
  GanttChartTaskColumn,
} from 'smart-webcomponents-angular/ganttchart';

@Component({
  standalone: true,
  selector: 'app-gantogram',
  imports: [GanttChartModule, ReactiveFormsModule],
  templateUrl: './gantogram.component.html',
  styleUrls: ['./gantogram.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GantComponent {
  title = 'smart-app';

  @ViewChild('gantt', { read: GanttChartComponent, static: false })
  gantt!: GanttChartComponent;

  durationUnit = 'hour';

  taskColumns: GanttChartTaskColumn[] = [
    {
      label: 'Tasks',
      value: 'label',
      size: '60%',
    },
    {
      label: 'Duration (hours)',
      value: 'duration',
      formatFunction: (date: string) => parseInt(date),
    },
  ];

  dataSource = [];
}
