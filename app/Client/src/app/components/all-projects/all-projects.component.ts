import { Component } from '@angular/core';
import { ProjectComponent } from "../../models/project/project.component";

@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [ProjectComponent]
})
export class AllProjectsComponent {

}
