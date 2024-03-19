import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from "./components/add-member/add-member.component";
import { AllMembersComponent } from "./components/all-members/all-members.component";
import { AllProjectsComponent } from "./components/all-projects/all-projects.component";
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AllRolesComponent } from "./components/all-roles/all-roles.component";
import { EditMemberComponent } from './components/edit-member/edit-member.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: "login", component: LoginComponent, data: { title: 'Login Menu' } },
  { path: "members/add", component: AddMemberComponent, data: { title: 'Add Member' }, canActivate: [AuthGuard] },
  { path: "members/all", component: AllMembersComponent, data: { title: 'All Members' }, canActivate: [AuthGuard] },
  { path: "members/edit/:id", component: EditMemberComponent, data: { title: 'Edit member'}, canActivate: [AuthGuard]}, //Umeso 1 treba da bude ID membera koji se edituje
  { path: "projects/all", component: AllProjectsComponent, data: { title: 'All Projects' }, canActivate: [AuthGuard] },
  { path: "projects/add", component: AddProjectComponent, data: { title: 'Add Project' }, canActivate: [AuthGuard]  },
  { path: "roles/all", component: AllRolesComponent, data: { title: 'All Roles' }, canActivate: [AuthGuard] },
  { path: 'roles/edit/:id', component: EditRoleComponent, data: { title: 'Edit Role' }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes {}
