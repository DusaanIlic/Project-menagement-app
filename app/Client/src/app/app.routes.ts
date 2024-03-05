import { Routes } from '@angular/router';
import { AllMembersComponentComponent } from './components/all-members-component/all-members-component.component';
import { AllProjectsComponentComponent } from './components/all-projects-component/all-projects-component.component';

export const routes: Routes = [
    {path: "memebrs/allMembers", component: AllMembersComponentComponent},
    {path: "projects/allProjects", component: AllProjectsComponentComponent}
];
