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
    acs = true;

    ngOnInit(): void {

        this.acs = true;
        this.member1 = {
            id: 1,
            fullName: 'AB',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

          this.members?.push(this.member1)

          this.member1 = {
            id: 1,
            fullName: 'C',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

          this.members?.push(this.member1)

          this.member1 = {
            id: 1,
            fullName: 'BA',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

          this.members.push(this.member1);
    }

    filteredMembers: Member[] = [];
    searchQuery: string = '';

    constructor() {
        this.filteredMembers = this.members;
        this.sort();
    }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMembers = this.members;
      return;
    }
    const regex = new RegExp(this.searchQuery.trim(), 'i');
    this.filteredMembers = this.members.filter(member => regex.test(member.fullName));
  }

  switchSort()
  {
    this.acs = !this.acs;
    this.sort();
  }

  sort()
  {
    
    if(this.acs)
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].fullName <= this.filteredMembers[i].fullName)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
    else
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].fullName > this.filteredMembers[i].fullName)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
  }
}

