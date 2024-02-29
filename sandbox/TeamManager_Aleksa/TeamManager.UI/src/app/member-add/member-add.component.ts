import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../member.interface';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent {
  member: Member = {
    id: 0,
    firstName: '',
    lastName: '',
    jobDescription: '',
    salary: 0
  };

  constructor(
    private memberService: MemberService,
    private router: Router
  ) { }

  addMember(): void {
    this.memberService.addMember(this.member).subscribe(() => {
      console.log(this.member)
      this.router.navigate(['/members']);
    });
  }
}
