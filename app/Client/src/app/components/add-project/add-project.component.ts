import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ProjectAddRequest } from '../../models/project-add';
import { tap } from 'rxjs/internal/operators/tap';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/add.project.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NgxEditorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  editor: Editor = new Editor();
  html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  isSuccess: boolean = false;
  isError: boolean = false;
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    deadLine: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
  });

  private project?: ProjectAddRequest;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>) {}
  closeDialog(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    /*if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const sanitizedFormValue: ProjectAddRequest = {
        projectName: formValue.projectName || '',
        deadLine: formValue.deadLine ? new Date(formValue.deadLine) : undefined,
        projectDescription: formValue.projectDescription || '',
      };

      this.projectService
        .createProject(sanitizedFormValue)
        .pipe(
          tap({
            next: (response) => {
              // Ako je projekat uspešno dodat
              console.log('Projekat je uspešno dodat', response);
              // poruka na korisničkom interfejsu
              this.showSuccessMessage();
            },
            error: (error) => {
              // Ako se dogodi greška prilikom dodavanja projekta
              console.error('Greška prilikom dodavanja projekta:', error);
              // poruka o grešci na korisničkom interfejsu
              this.showErrorMessage();
            },
          })
        )
        .subscribe();
    }
  }
  showErrorMessage() {
    this.isError = true;
    this.isSuccess = false;
  }
  showSuccessMessage() {
    this.isSuccess = true;
    this.isError = false;
  }*/
  }
}
