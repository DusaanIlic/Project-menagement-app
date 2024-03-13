import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../member';
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
            name: 'Pera',
            lastName: 'Peric',
            email: 'peraperic@gmail.com',
            phone: '1.1.2024.',
            role: 'Project Menager',
            dateOfEmployment : new Date(),
          };

        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
        this.members?.push(this.member1)
    }
}
