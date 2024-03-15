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
    sortByName = true;
    sortByEmail = true;
    sortByDate = true;

    ngOnInit(): void {
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
        this.sortNames();
        this.sortEmails();
        this.sortDates();
    }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMembers = this.members;
      return;
    }
    const regex = new RegExp(this.searchQuery.trim(), 'i');
    this.filteredMembers = this.members.filter(member => regex.test(member.fullName));
  }

  switchSortName()
  {
    this.sortByName = !this.sortByName;
    this.sortNames();
  }

  switchSortEmail()
  {
    this.sortByEmail = !this.sortByEmail;
    this.sortEmails();
  }

  switchSortDate()
  {
    this.sortByDate = !this.sortByDate;
    this.sortDates();
  }

  sortNames()
  {
    
    if(this.sortByName)
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


  sortEmails()
  {
    
    if(this.sortByEmail)
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].email <= this.filteredMembers[i].email)
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
          if(this.filteredMembers[j].email > this.filteredMembers[i].email)
          {
            let temp = this.filteredMembers[j];
            this.filteredMembers[j] = this.filteredMembers[i];
            this.filteredMembers[i] = temp;
          }
        }
      }
    }
  }


  sortDates()
  {
    
    if(this.sortByDate)
    {
      for(let i=0;i<this.filteredMembers.length-1;i++)
      {
        for(let j=i+1;j<this.filteredMembers.length;j++)
        {
          if(this.filteredMembers[j].dateAdded <= this.filteredMembers[i].dateAdded)
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
          if(this.filteredMembers[j].dateAdded > this.filteredMembers[i].dateAdded)
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

