import { Component, Input } from '@angular/core';
import {  MemberComponent } from "../../models/member/member.component";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-member',
    standalone: true,
    templateUrl: './add-member.component.html',
    styleUrl: './add-member.component.scss',
    imports: [MemberComponent, FormsModule]
})
export class AddMemberComponent {
    //@Input()
    name: string = "Dusan";
    public onClick(){
        console.log(this.name);
    }

}


