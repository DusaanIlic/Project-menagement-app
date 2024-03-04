import { Component } from '@angular/core';
import { Member } from '../member';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
  member: Member = {
    id: 1,
    name: 'Pera',
    lastName: 'Peric',
    email: 'peraperic@gmail.com',
    phone: '066/123456',
    role: 'Project Menager'
  };
}
