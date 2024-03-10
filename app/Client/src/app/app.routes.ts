import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from "./components/add-member/add-member.component";
import { AllMembersComponent } from "./components/all-members/all-members.component";
import { AllProjectsComponent } from "./components/all-projects/all-projects.component";
import { AddProjectComponent } from './components/add-project/add-project.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent, data: { title: 'Login Menu' } },
    { path: "members/add", component: AddMemberComponent,  },
    { path: "members/all", component: AllMembersComponent, data: { title: 'All Members' } },
    { path: "projects/all", component: AllProjectsComponent, data: { title: 'All Projects' } },
    { path: "projects/add", component: AddProjectComponent, data: { title: 'Add Project' }  }
]
