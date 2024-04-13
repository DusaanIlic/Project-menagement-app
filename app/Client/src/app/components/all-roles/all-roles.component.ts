import { Component, OnInit } from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Role} from "../../models/role";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-all-roles',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterModule,
    FormsModule,
    MatButton,
    MatMenu,
    MatMenuItem,
    ReactiveFormsModule,
    NgIf,
    MatMenuTrigger,
    DatePipe
  ],
  templateUrl: './all-roles.component.html',
  styleUrl: './all-roles.component.scss'
})

export class AllRolesComponent implements OnInit {
  roles: Role[] = [];

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe({
      next: data => {
        this.roles = data;

        console.log(this.roles);
      },
      error: error => {

      }
    });
  }
}

