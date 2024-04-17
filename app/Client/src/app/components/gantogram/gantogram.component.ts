import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
//import { GanttModule } from '@syncfusion/ej2-angular-gantt';

@Component({
  standalone: true,
  selector: 'app-gantogram',
  imports: [ReactiveFormsModule],
  templateUrl: './gantogram.component.html',
  styleUrls: ['./gantogram.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GantComponent implements OnInit {
  public data: object[] | undefined;
  public resources: object[] | undefined;
  public resourceFields: object | undefined;
  public taskSettings: object | undefined;
  public columns: object[] | undefined;
  public timelineSettings: object | undefined;
  public gridLines: string | undefined;
  public labelSettings: object | undefined;
  public projectStartDate: Date | undefined;
  public projectEndDate: Date | undefined;
  public editSettings: object | undefined;
  public eventMarkers: object[] | undefined;
  public toolbar: string[] | undefined;
  public splitterSettings: object | undefined;
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
      notes: 'info',
      resourceInfo: 'resources',
    };
    this.resourceFields = {
      id: 'resourceId',
      name: 'resourceName',
    };
    this.editSettings = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      allowTaskbarEditing: true,
      showDeleteConfirmDialog: true,
    };
    this.toolbar = [
      'Add',
      'Edit',
      'Update',
      'Delete',
      'Cancel',
      'ExpandAll',
      'CollapseAll',
      'Indent',
      'Outdent',
    ];
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
    this.timelineSettings = {
      topTier: {
        unit: 'Week',
        format: 'MMM dd, y',
      },
      bottomTier: {
        unit: 'Day',
        count: 1,
      },
    };
    this.gridLines = 'Both';
    this.labelSettings = {
      leftLabel: 'TaskName',
      rightLabel: 'resources',
    };
    this.projectStartDate = new Date('03/25/2019');
    this.projectEndDate = new Date('07/28/2019');
    this.eventMarkers = [
      { day: '4/17/2019', label: 'Project approval and kick-off' },
      { day: '5/3/2019', label: 'Foundation inspection' },
      { day: '6/7/2019', label: 'Site manager inspection' },
      { day: '7/16/2019', label: 'Property handover and sign-off' },
    ];

    this.splitterSettings = {
      position: '35%',
    };
  }
}
