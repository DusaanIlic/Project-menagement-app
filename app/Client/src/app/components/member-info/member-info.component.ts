import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-info',
  standalone: true,
  imports: [FormsModule, CommonModule,  MatIconModule, NgOptimizedImage],
  templateUrl: './member-info.component.html',
  styleUrl: './member-info.component.scss'
})
export class MemberInfoComponent {
  member: Member;

  constructor(public dialogRef: MatDialogRef<MemberInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    this.member = data.member;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
