import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from "./components/add-member/add-member.component";
import { AllMembersComponent } from "./components/all-members/all-members.component";
import { AllProjectsComponent } from "./components/all-projects/all-projects.component";
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AllRolesComponent } from "./components/all-roles/all-roles.component";
import { EditMemberComponent } from './components/edit-member/edit-member.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent, data: { title: 'Login Menu' } },
  { path: "members/add", component: AddMemberComponent, data: { title: 'Add Member' } },
  { path: "members/all", component: AllMembersComponent, data: { title: 'All Members' } },
  { path: "projects/all", component: AllProjectsComponent, data: { title: 'All Projects' } },
  { path: "projects/add", component: AddProjectComponent, data: { title: 'Add Project' }  },
  { path: "roles/all", component: AllRolesComponent, data: { title: 'All Roles' } },
  { path: "edit/1", component: EditMemberComponent, data: { title: 'Edit members'}} //Umeso 1 treba da bude ID membera koji se edituje
]
