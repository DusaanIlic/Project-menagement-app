import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProjectAddRequest } from '../../models/project-add';
import { ProjectService } from '../../services/add.project.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.scss',
})
export class AddProjectDialogComponent {
  isSuccess: boolean = false;
  isError: boolean = false;
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    deadLine: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
  });

  private project?: ProjectAddRequest;

  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<AddProjectDialogComponent>
  ) {}

  public onSubmit() {}
  public closeDialog() {
    this.dialogRef.close();
  }
}
