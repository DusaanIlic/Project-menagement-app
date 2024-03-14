import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-all-members',
    standalone: true,
    templateUrl: './all-members.component.html',
    styleUrl: './all-members.component.scss',
    imports: [CommonModule, RouterLink]
})
export class AllMembersComponent implements OnInit{


    members : Member[] = [];
    member1? : Member;

    addNewMember()
    {
        console.log("Add memeber");
    }

    ngOnInit(): void {

        this.member1 = {
            id: 1,
            fullName: 'Pera Peric',
            email: 'peraperic@gmail.com',
            role: 'Project Menager',
            dateAdded : '2024-03-13',
          };

        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
    }
}
