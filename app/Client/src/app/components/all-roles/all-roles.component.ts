import { Component } from '@angular/core';
import {Role} from "../../models/role";

@Component({
  selector: 'app-all-roles',
  standalone: true,
  imports: [],
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
