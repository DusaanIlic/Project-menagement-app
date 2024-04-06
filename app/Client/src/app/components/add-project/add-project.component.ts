import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/add.project.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [FormsModule, CommonModule, NgxEditorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddProjectComponent implements OnDestroy {
  editor: Editor = new Editor();
  html = '';

  projectName: string = '';
  projectDescription: string = '';
  deadLine!: Date;

  @Output() projectAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService
  ) {}

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    const projectData = {
      projectName: this.projectName,
      projectDescription: this.html,
      deadLine: this.deadLine,
    };

    this.projectService.createProject(projectData).subscribe(
      (response) => {
        console.log('Project saved successfully:', response);
        this.projectAdded.emit();
        this.closeDialog();
      },
      (error) => {
        console.error('Project saving task', error);
      }
    );
  }
}
