import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Role} from "../../models/role";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {ProjectServiceGet} from "../../services/project.service";
import {Permission} from "../../models/permission";

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
export class ProjectRoleOverviewComponent implements OnInit, OnDestroy {
  roles: any[] = [];
  permissions: any[] = [];
  selectedRole: any;
  roleForm: any;
  projectId: any;
  private projectSubscription: any;

  constructor(public dialogRef: MatDialogRef<ProjectRoleOverviewComponent>, public projectService: ProjectServiceGet,
              private snackBar: MatSnackBar, private cdRef: ChangeDetectorRef, private matDialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) data: any) {
    this.projectId = data.projectId;
  }

  ngOnInit(): void {
    this.projectSubscription = this.projectService.getAllRoles(this.projectId).pipe(
      switchMap((roles : Role[]) => {
        this.roles = roles;

        this.roleForm = new FormGroup({
          name: new FormControl('', [
            Validators.required,
            this.uniqueRoleNameValidator(this.roles)
          ])
        });

        return this.projectService.getAllPermissions();
      })
    ).subscribe({
      next: (permissions : Permission[]) => {
        this.permissions = permissions;

        console.log(this.permissions);
        console.log(this.roles);
      },
      error: error => {
        this.snackBar.open('Error fetching data. Please try again.', 'Close', {
          duration: 3000, // Snackbar duration
          panelClass: ['snackbar-error'] // Optional custom styling
        });
      }
    })

  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  uniqueRoleNameValidator(roles: any[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nameExists = roles.some(role => role.name === control.value && role.id != this.selectedRole?.id);
      return nameExists ? {'nameExists': {value: control.value}} : null;
    };
  }

  addRole() {

  }

  trackByRole(index: number, role: Role): number {
    return role.id; // Assuming each role has a unique ID
  }

  selectRole(role: Role) {
    this.selectedRole = role;

    this.roleForm.patchValue({
      name: this.selectedRole.name,
    });

    if (this.selectedRole.isDefault) {
      this.roleForm.get('name').disable();
    } else {
      this.roleForm.get('name').enable();
    }

    this.roleForm.markAsPristine();
  }

  isPermissionAssigned(roleId: number, permissionId: number): boolean {
    return false;
  }

  togglePermission(checked: boolean, roleId: number, permissionId: number): void {

  }

  deleteRole(id: any) {

  }

  saveGeneral() {

  }
}
