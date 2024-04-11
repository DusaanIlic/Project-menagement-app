import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../models/member';
import { MemberOverviewComponent } from '../member-overview/member-overview.component';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-member-info',
  standalone: true,
  imports: [FormsModule, CommonModule,  MatIconModule, NgOptimizedImage, MemberOverviewComponent, RouterLink, RouterLinkActive],
  templateUrl: './member-info.component.html',
  styleUrl: './member-info.component.scss'
})
export class MemberInfoComponent {
  member: Member;

  constructor(public dialogRef: MatDialogRef<MemberInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public dialogRef2: MatDialogRef<MemberInfoComponent>, private route: ActivatedRoute){
    this.member = data.member;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }



}
