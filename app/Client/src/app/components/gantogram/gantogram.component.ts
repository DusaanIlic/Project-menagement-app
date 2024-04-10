import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';

@Component({
  standalone: true,
  selector: 'app-gantogram',
  imports: [GanttModule, ReactiveFormsModule],
  templateUrl: './gantogram.component.html',
  styleUrls: ['./gantogram.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GantComponent implements OnInit {
  public data: object[] | undefined;
  public taskSettings: object | undefined;
  public columns: object[] | undefined;
  public labelSettings: object | undefined;
  public projectStartDate: Date | undefined;
  public projectEndDate: Date | undefined;
  public ngOnInit(): void {
    this.taskSettings = {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      child: 'subtasks',
    };
    this.columns = [
      { field: 'TaskID', width: 80 },
      {
        field: 'TaskName',
        headerText: 'Job Name',
        width: '250',
        clipMode: 'EllipsisWithTooltip',
      },
      { field: 'StartDate' },
      { field: 'Duration' },
      { field: 'Progress' },
      { field: 'Predecessor' },
    ];
    this.projectStartDate = new Date('03/24/2019');
    this.projectEndDate = new Date('07/06/2019');
    this.labelSettings = {
      leftLabel: 'TaskName',
    };
  }
}
