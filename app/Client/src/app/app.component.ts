import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddMemberComponent } from "./components/add-member/add-member.component";
import { AllProjectsComponentComponent } from "./components/all-projects-component/all-projects-component.component";
import { AllMembersComponentComponent } from "./components/all-members-component/all-members-component.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AllProjectsComponentComponent, AllMembersComponentComponent]
})
export class AppComponent {
  title = 'Client';
}
