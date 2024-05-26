import {Component, Input, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {ProjectFile} from "../../models/project-file";
import {ProjectServiceGet} from "../../services/project.service";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-project-files',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    NgIf,
    MatIcon,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIconButton
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss'
})
export class ProjectFilesComponent implements OnInit {
  @Input({
    required: true
  }) projectId: number = 0;

  files: ProjectFile[] = [];

  constructor(
    private projectService: ProjectServiceGet
  ) {

  }

  ngOnInit(): void {
    this.projectService.getProjectFiles(this.projectId).subscribe({
      next: (data: ProjectFile[]) => {
        this.files = data;
      },
      error: err => {
        console.log('failed fetching project files');
      }
    })
  }
}
