import { Routes } from '@angular/router';
import { RegisterMemberComponent } from './Components/PublicPages/register-member/register-member.component';
import { RegistrationDetailsComponent } from './Components/PublicPages/registration-details/registration-details.component';
import { LoginComponent } from './Components/PublicPages/login/login.component';
import { ListMembersComponent } from './Components/Admin/list-members/list-members.component';
import { AuthGuard } from './Core/Interceptors/auth.guard';

export const routes: Routes = [
    { path: '', component: RegisterMemberComponent },
    { path: 'registration-details/:uid', component: RegistrationDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-members', component: ListMembersComponent,canActivate:[AuthGuard], },
];
