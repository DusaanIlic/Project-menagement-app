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
    type: ChartType.Gantt, // Koristite ChartType.Gantt umesto 'Gantt'
    data: [
      [
        'Task ID',
        'Task Name',
        'Resource',
        'Start Date',
        'End Date',
        'Duration',
        'Percent Complete',
        'Dependencies',
      ],
      [
        '2014Spring',
        'Spring 2014',
        'spring',
        new Date(2014, 2, 22),
        new Date(2014, 5, 20),
        null,
        100,
        null,
      ],
      // Dodajte više redova prema potrebi
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
