import {Component, OnInit} from '@angular/core';
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
    MatTab
  ],
  templateUrl: './role-overview.component.html',
  styleUrl: './role-overview.component.scss'
})
export class RoleOverviewComponent implements OnInit {
  roles: Role[] = [];

  constructor(public dialogRef: MatDialogRef<RoleOverviewComponent>, public roleService: RoleService) { }

  ngOnInit() {
    this.roleService.getAllRoles().subscribe({
      next: data => {
        console.log('runs');
        this.roles = data;
      },
      error: error => {

      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
