import { Component } from '@angular/core';
import {Role} from "../../models/role";
import {NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-all-roles',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './all-roles.component.html',
  styleUrl: './all-roles.component.scss'
})
export class AllRolesComponent {
  roles: Role[] = [
    { id: 1, name: 'Administrator', count: 1 },
    { id: 2, name: 'Project Manager', count: 2 },
    { id: 3, name: 'Worker', count: 3 },
    { id: 4, name: 'Guest', count: 4 }
  ];
}
