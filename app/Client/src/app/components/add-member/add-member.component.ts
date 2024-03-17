import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MemberService} from "../../services/member.service";

@Component({
    selector: 'app-add-member',
    standalone: true,
    templateUrl: './add-member.component.html',
    styleUrl: './add-member.component.scss',
    imports: [FormsModule]
})
export class AddMemberComponent {
    //@Input()
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    phone: string = "";
    role: string = "";
    date: string = "";
    info: string = "";

    constructor(private memberService: MemberService) { }

    public onClick(){
        console.log(this.firstName);
        console.log(this.lastName);
        console.log(this.email);
        console.log(this.phone);
        console.log(this.date);
        console.log(this.info);
    }
}


