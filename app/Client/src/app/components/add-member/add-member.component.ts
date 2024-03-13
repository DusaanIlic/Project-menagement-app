import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-member',
    standalone: true,
    templateUrl: './add-member.component.html',
    styleUrl: './add-member.component.scss',
    imports: [FormsModule]
})
export class AddMemberComponent {
    //@Input()
    name: string = "";
    lname: string = "";
    email: string = "";
    phone: string = "";
    date: string = "";
    info: string = "";

    public onClick(){
        console.log(this.name);
        console.log(this.lname);
        console.log(this.email);
        console.log(this.phone);
        console.log(this.date);
        console.log(this.info);
    }

}


