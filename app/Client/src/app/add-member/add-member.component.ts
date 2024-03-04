import { Component } from '@angular/core';
import { MemberComponent } from "../member/member.component";

@Component({
    selector: 'app-add-member',
    standalone: true,
    templateUrl: './add-member.component.html',
    styleUrl: './add-member.component.scss',
    imports: [MemberComponent]
})
export class AddMemberComponent {

}
