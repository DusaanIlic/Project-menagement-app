import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/add.project.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { ActivatedRoute } from '@angular/router';
import { ProjectAddRequest } from '../../models/project-add';
import { NgToastModule, NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [FormsModule, CommonModule, NgxEditorModule, NgToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddProjectComponent implements OnDestroy {
  todayDate = new Date().toISOString().split('T')[0];

  editor: Editor = new Editor();
  html = '';

  projectName!: string;
  projectDescription!: string;
  deadLine!: Date;

  @Output() projectAdded: EventEmitter<any> = new EventEmitter<any>();

  projectForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private _ngToastService: NgToastService
  ) {}

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMessage() {
    this._ngToastService.success({
      detail: 'Success Message',
      summary: 'Project added successfully!',
      duration: 3000,
    });
  }

  showMessageError() {
    this._ngToastService.error({
      detail: 'Error Message',
      summary: 'Project add failed!',
      duration: 3000,
    });
  }

  public onSubmit() {
    /*this.projectForm = new FormGroup({
      projectName: new FormControl(this.projectName, Validators.required),
      projectDescription: new FormControl(this.html, Validators.required),
      deadLine: new FormControl(this.deadLine, Validators.required),
    });*/
    //const projectData: ProjectAddRequest = this.projectForm.value;

    const projectData = {
      projectName: this.projectName,
      projectDescription: this.html.trim(),
      deadLine: this.deadLine,
    };
    if (!this.projectName) {
      // Provera da li je uneti tekst prazan
      alert('Morate uneti naziv projeta!');
      return;
    }
    if (!this.html.trim()) {
      // Provera da li je uneti tekst prazan
      alert('Morate uneti opis projeta!');
      return;
    }
    if (!this.deadLine) {
      // Provera da li je uneti tekst prazan
      alert('Morate uneti datum!');
      return;
    }

    this.projectService.createProject(projectData).subscribe(
      (response) => {
        //console.log('Project saved successfully:', response);
        this.projectAdded.emit();
        this.showMessage();
        this.closeDialog();
      },
      (error) => {
        this.showMessageError();
        //console.error('Error saving project', error);
      }
    );
  }
}
