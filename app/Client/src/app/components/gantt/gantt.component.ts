import { Component } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './gantt.component.html',
  styleUrl: './gantt.component.scss',
})
export class GanttComponent {
  chartData = {
    type: ChartType.Gantt,
    data: [
      [
        '2014Spring',
        'Spring 2014',
        'spring',
        new Date(2014, 2, 22),
        new Date(2014, 5, 20),
        5,
        100,
        null,
      ],
      [
        '2015Spring',
        'Spring 2015',
        'spring',
        new Date(2015, 2, 22),
        new Date(2015, 5, 20),
        5,
        0,
        null,
      ],
    ],
    columnNames: [
      'Task ID',
      'Task Name',
      'Resource',
      'Start Date',
      'End Date',
      'Duration',
      'Percent Complete',
      'Dependencies',
    ],
    options: {
      height: 400,
      gantt: {
        trackHeight: 30,
      },
    },
  };
}
