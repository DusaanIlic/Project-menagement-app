import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl, FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectAddRequest } from '../../models/project-add';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatToolbar} from "@angular/material/toolbar";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {ProjectServiceGet} from "../../services/project.service";

@Component({
  selector: 'app-add-project',
  standalone: true,
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    NgToastModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    MatSelect,
    MatToolbar,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatOption,
    MatDatepickerModule,
    MatSuffix
  ]
})
export class AddProjectComponent implements OnInit {
  @Output() projectAdded: EventEmitter<any> = new EventEmitter<any>();

  projectForm!: FormGroup;
  projectPriorities: any;

  today: Date = new Date(); // Initialize today's date

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private projectService: ProjectServiceGet, private _ngToastService: NgToastService,
                  private fb: FormBuilder) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required],
      deadline: ['', Validators.required],
      priorityId: ['', Validators.required]
    });

    this.projectService.getProjectPriorities().subscribe({
      next: data => {
        this.projectPriorities = data;
      },
      error: error => {
        console.log('error fetching project priorities');
      }
    });
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

  addProject() {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      this.projectService.addProject(projectData).subscribe({
        next: (response: any) => {
          // Close the dialog
          this.closeDialog();

          // Emit an event to notify parent component
          this.projectAdded.emit(response);

          // Show success message
          this.showMessage();
        },
        error: (error: any) => {
          // Show error message
          this.showMessageError();

          // Log the error
          console.log('Error adding project:', error);
        }
      });
    } else {
      // Mark all form controls as touched to display validation errors
      this.projectForm.markAllAsTouched();
    }
  }
}
