import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit{

  lessThanHour : boolean = false;
  difference : number = 0;
  constructor(public dialogRef: MatDialogRef<TaskOverviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    this.dateCheck();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  dateCheck()
  {
    this.difference = new Date().getTime() - this.data.activities.dateModified.getTime();
    console.log((Math.trunc(this.difference) / (1000 * 60)));

    if(this.difference < 60)
      this.lessThanHour = true;
    else
      this.lessThanHour = false;
  }

  

}
