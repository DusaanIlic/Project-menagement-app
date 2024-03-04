import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddMemberComponent } from "./add-member/add-member.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AddMemberComponent]
})
export class AppComponent {
  title = 'Client';
}
