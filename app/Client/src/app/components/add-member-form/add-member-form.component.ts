import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-form',
  templateUrl: './add-member-form.component.html',
  styleUrls: ['./add-member-form.component.scss']
})
export class AddMemberFormComponent implements OnInit {
  isDialogOpen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.dialogRef.componentInstance.data && this.dialogRef.componentInstance.data.isDialogOpen) {
      this.dialogRef.componentInstance.data.isDialogOpen = false;
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
