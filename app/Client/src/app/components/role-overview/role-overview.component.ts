import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {NgForOf, NgIf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatOption} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatLabel, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {forkJoin, map} from "rxjs";
import {switchMap} from "rxjs/operators";
import {AddRoleForm} from "../../forms/add-role.form";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDivider} from "@angular/material/divider";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {UpdateRoleForm} from "../../forms/update-role.form";

@Component({
  selector: 'app-role-overview',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatButton,
    NgForOf,
    NgIf,
    MatTabGroup,
    MatTab,
    MatCard,
    MatCardContent,
    MatOption,
    MatSelect,
    MatFormField,
    MatInput,
    MatLabel,
    MatCardHeader,
    MatCardTitle,
    MatCheckbox,
    MatDivider,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: './role-overview.component.html',
  styleUrl: './role-overview.component.scss'
})
export class RoleOverviewComponent implements OnInit {
  roles: any[] = [];
  permissions: any[] = [];
  rolePermissions: any[] = [];
  selectedRole: any;
  roleForm: any;

  constructor(public dialogRef: MatDialogRef<RoleOverviewComponent>, public roleService: RoleService,
                private snackBar: MatSnackBar, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    const roles$ = this.roleService.getAllRoles();
    const permissions$ = this.roleService.getAllPermissions();

    forkJoin([roles$, permissions$]).pipe(
      switchMap(([roles, permissions]) => {
        this.roles = roles;
        this.permissions = permissions;

        this.roleForm = new FormGroup({
          name: new FormControl('', [
            Validators.required,
            this.uniqueRoleNameValidator(this.roles)
          ])
        });

        const rolePermissionRequests = roles.map(role => {
          return this.roleService.getRoleWithPermissions(role.id).pipe(
            map((permissions) => ({ roleId: role.id, permissions }))
          );
        });

        return forkJoin(rolePermissionRequests);
      })
    ).subscribe(rolePermissions => {
      this.rolePermissions = rolePermissions;
    });
  }

  uniqueRoleNameValidator(roles: any[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nameExists = roles.some(role => role.name === control.value && role.id != this.selectedRole?.id);
      return nameExists ? {'nameExists': {value: control.value}} : null;
    };
  }

  isPermissionAssigned(roleId: number, permissionId: number): boolean {
    const rolePermission = this.rolePermissions.find(rp => rp.roleId === roleId);

    if (rolePermission) {
      return rolePermission.permissions.some((p: { permissionId: number; }) => {
        return p.permissionId === permissionId;
      });
    }

    return false;
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  saveGeneral() {
    if (this.roleForm.valid) {
      this.roleForm.patchValue({
        name: this.roleForm.get('name').value.trim()
      });

      const data: UpdateRoleForm = this.roleForm.value;
      const selectedRole = this.selectedRole;

      this.roleService.updateRole(this.selectedRole.id, data).subscribe({
        next: data => {
          const index = this.roles.findIndex(role => role.id === selectedRole.id);

          if (index !== -1) {
            this.roles[index] = data;
          }

          // Trigger view update
          this.cdRef.detectChanges();
          this.roleForm.markAsPristine();

          this.snackBar.open('Successfully changed settings!', 'Close', { duration: 3000 });
        },
        error: error => {
          this.snackBar.open('Error updating role.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Failed to change settings, input is invalid!', 'Close', { duration: 3000 });
    }
  }

  addRole() {
    let newRoleName = `New Role 1`;
    let id = 1;

    // Check if a role with the same name already exists
    while (this.roles.some(role => role.name === newRoleName)) {
      id++;
      newRoleName = `New Role ${id}`;
    }

    const addRoleForm: AddRoleForm = {
      name: newRoleName
    }

    this.roleService.addRole(addRoleForm).subscribe({
      next: data => {
        this.roles = [...this.roles, data]; // Add the new role locally
        this.snackBar.open('Role added successfully!', 'Close', { duration: 3000 });
      },
      error: error => {
        this.snackBar.open('Failed to add role!', 'Close', { duration: 3000 });
      }
    });
  }
}
