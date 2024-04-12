import { Component, OnInit } from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Role} from "../../models/role";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";

@Component({
  selector: 'app-all-roles',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterModule,
    CommonModule,
    FormsModule,
    MatButton,
    MatMenu,
    MatMenuItem,
    ReactiveFormsModule
  ],
  templateUrl: './all-roles.component.html',
  styleUrl: './all-roles.component.scss'
})

export class AllRolesComponent implements OnInit {
  saveChanges: boolean = false;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.saveChanges = params['saved'] == 'true';
    });
  }

  roles: Role[] = [
    { id: 1, name: 'Administrator', count: 1 },
    { id: 2, name: 'Project Manager', count: 2 },
    { id: 3, name: 'Worker', count: 3 },
    { id: 4, name: 'Guest', count: 4 }
  ];
}

