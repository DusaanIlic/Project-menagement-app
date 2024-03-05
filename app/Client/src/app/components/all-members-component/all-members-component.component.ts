import { Component } from '@angular/core';
import { MemberComponent } from "../../models/member/member.component";

@Component({
    selector: 'app-all-members-component',
    standalone: true,
    templateUrl: './all-members-component.component.html',
    styleUrl: './all-members-component.component.scss',
    imports: [MemberComponent]
})
export class AllMembersComponentComponent {

}
