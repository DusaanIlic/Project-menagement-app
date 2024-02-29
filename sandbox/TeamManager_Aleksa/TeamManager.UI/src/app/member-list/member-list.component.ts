import { Component, OnInit } from '@angular/core';
import { Member } from '../member.interface';
import { MemberService } from '../member.service';
import { Router} from "@angular/router";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    });
  }

  deleteMember(id: number): void {
    this.memberService.deleteMember(id).subscribe(() => {
      this.members = this.members.filter(member => member.id !== id);
    });
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/update', id]);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/members', id]);
  }
}
