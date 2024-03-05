import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AddMemberComponent } from './components/add-member/add-member.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "members/add", component: AddMemberComponent }
];
