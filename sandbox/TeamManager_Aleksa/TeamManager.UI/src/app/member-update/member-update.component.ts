import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Member } from '../member.interface';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-update',
  templateUrl: './member-update.component.html',
  styleUrls: ['./member-update.component.css']
})
export class MemberUpdateComponent implements OnInit {
  member: Member | undefined;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMember();
  }

  getMember(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.memberService.getMember(id).subscribe(member => this.member = member);
  }

  updateMember(): void {
    if (this.member) {
      this.memberService.updateMember(this.member).subscribe(() => {
        this.router.navigate(['/members']);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
