import {ChangeDetectorRef, Component} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../services/role.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-project-role-overview',
  standalone: true,
  imports: [
    MatAnchor,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCheckbox,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTab,
    MatTabGroup,
    MatToolbar,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './project-role-overview.component.html',
  styleUrl: './project-role-overview.component.scss'
})
export class ProjectRoleOverviewComponent {
  roles: any[] = [];
  permissions: any[] = [];
  selectedRole: any;
  roleForm: any;

  constructor(public dialogRef: MatDialogRef<ProjectRoleOverviewComponent>, public roleService: RoleService,
              private snackBar: MatSnackBar, private cdRef: ChangeDetectorRef, private matDialog: MatDialog) { }

  addRole() {

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
