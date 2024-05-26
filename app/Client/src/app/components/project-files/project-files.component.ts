import {Component, Input, OnInit} from '@angular/core';
import {MatButton, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {ProjectFile} from "../../models/project-file";
import {ProjectServiceGet} from "../../services/project.service";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatDialog} from "@angular/material/dialog";
import {Member} from "../../models/member";
import {MemberInfoComponent} from "../member-info/member-info.component";
import {RouterLink} from "@angular/router";
import {environment} from "../../../environments/environment";
import {ProjectPermission} from "../../enums/project-permissions.enum";
import {HasProjectPermissionPipe} from "../../pipes/has-project-permission.pipe";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Project} from "../../models/project";
import {MatPaginator} from "@angular/material/paginator";

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
    MatIconButton,
    MatDivider,
    RouterLink,
    HasProjectPermissionPipe,
    MatCardActions,
    MatPaginator,
    MatCardTitle,
    MatIconAnchor
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss'
})
export class ProjectFilesComponent implements OnInit {
  @Input({
    required: true
  }) projectId: number = 0;

  files: ProjectFile[] = [];
  authId: number = Number(this.authService.getAuthenticatedMembersId());

  constructor(
    private projectService: ProjectServiceGet,
    private authService: AuthService,
    private snackBar: MatSnackBar
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
    });
  }

  protected readonly environment = environment;
  protected readonly ProjectPermission = ProjectPermission;

  deleteFile(fileId: number) {
    this.projectService.deleteProjectFile(this.projectId, fileId).subscribe({
      next: data => {
        const indexToRemove = this.files.findIndex((file: ProjectFile) => file.fileId == fileId);
        if (indexToRemove !== -1)
          this.files.splice(indexToRemove, 1);

        this.snackBar.open('Successfully deleted file!', 'Close', { duration: 3000 });
      },
      error: err => {
        this.snackBar.open('Failed deleting file!', 'Close', { duration: 3000 });
      }
    })
  }

  uploadFiles(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const formData: FormData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }

      this.projectService.uploadFiles(this.projectId, formData).subscribe({
        next: data => {
          this.ngOnInit();
          this.snackBar.open('Successfully uploaded files!', 'Close', { duration: 3000 });
        },
        error: err => {
          this.snackBar.open('There was an error with uploading your files!', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('No files detected for upload!', 'Close', { duration: 3000 });
    }
  }
}
