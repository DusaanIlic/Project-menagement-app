import {Component, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-project-files',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss'
})
export class ProjectFilesComponent {
  @Input({
    required: true
  }) projectId: number = 0;


}
