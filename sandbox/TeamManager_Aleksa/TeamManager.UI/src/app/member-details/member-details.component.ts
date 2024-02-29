import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Member } from '../member.interface';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getMember();
  }

  getMember(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.memberService.getMember(id).subscribe(member => this.member = member);
  }

  goBack(): void {
    this.location.back();
  }
}
