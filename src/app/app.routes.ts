import { Routes } from '@angular/router';
import { RegisterMemberComponent } from './Components/PublicPages/register-member/register-member.component';
import { RegistrationDetailsComponent } from './Components/PublicPages/registration-details/registration-details.component';
import { LoginComponent } from './Components/PublicPages/login/login.component';
import { ListMembersComponent } from './Components/Admin/list-members/list-members.component';
import { AuthGuard } from './Core/Interceptors/auth.guard';
import { EmailTemplatesComponent } from './Components/Admin/email-templates/email-templates.component';
import { UpdateEmailTemplateComponent } from './Components/Admin/update-email-template/update-email-template.component';
import { EmailLogComponent } from './Components/Admin/email-log/email-log.component';

export const routes: Routes = [
    { path: '', component: RegisterMemberComponent },
    { path: 'registration-details/:uid', component: RegistrationDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-members', component: ListMembersComponent, canActivate: [AuthGuard], },
    { path: 'email-templates', component: EmailTemplatesComponent, canActivate: [AuthGuard] },
    {
        path: 'update-email-template/:id',
        component: UpdateEmailTemplateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'email-logs/:recordId',
        component: EmailLogComponent,
        canActivate: [AuthGuard]
    }

];
