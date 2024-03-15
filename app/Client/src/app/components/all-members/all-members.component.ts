import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member';
import {RouterLink} from "@angular/router";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-all-members',
    standalone: true,
    templateUrl: './all-members.component.html',
    styleUrl: './all-members.component.scss',
    imports: [CommonModule, RouterLink, FormsModule]
})
export class AllMembersComponent implements OnInit{

    members : Member[] = [];
    member1? : Member;

    ngOnInit(): void {

        this.member1 = {
            id: 1,
            fullName: 'Pera Peric',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

          this.members?.push(this.member1)

          this.member1 = {
            id: 1,
            fullName: 'Mika Mikic',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

          this.members?.push(this.member1)

          this.member1 = {
            id: 1,
            fullName: 'Laza Lazic',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
    }

    filteredMembers: Member[] = [];
    searchQuery: string = '';

    constructor() {
        this.filteredMembers = this.members;
    }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMembers = this.members;
      return;
    }
    const regex = new RegExp(this.searchQuery.trim(), 'i');
    this.filteredMembers = this.members.filter(member => regex.test(member.fullName));
  }
}
