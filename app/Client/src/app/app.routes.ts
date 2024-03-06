import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from "./components/add-member/add-member.component";
import { AllMembersComponentComponent } from "./components/all-members-component/all-members-component.component";
import { AllProjectsComponentComponent } from "./components/all-projects-component/all-projects-component.component";
import { ProjectAddComponent } from './components/project-add/project-add.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "members/add", component: AddMemberComponent },
    { path: "members/all", component: AllMembersComponentComponent },
    { path: "projects/all", component: AllProjectsComponentComponent },
    { path: "projects/add", component: ProjectAddComponent  }
]
