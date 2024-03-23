import { Component, Input } from '@angular/core';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [],
  templateUrl: './member-overview.component.html',
  styleUrl: './member-overview.component.scss'
})
export class MemberOverviewComponent {

  member : Member = {
    id: 1,
    fullName: 'Pera Peric',
    email: 'pera.peric@gmail.com',
    role: 'Project Manager',
    dateAdded: '1/1/2024'
  };
}
