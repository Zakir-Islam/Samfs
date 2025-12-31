import { Routes } from '@angular/router';
import { RegisterMemberComponent } from './Components/PublicPages/register-member/register-member.component';
import { RegistrationDetailsComponent } from './Components/PublicPages/registration-details/registration-details.component';
import { LoginComponent } from './Components/PublicPages/login/login.component';
import { ListMembersComponent } from './Components/Admin/list-members/list-members.component';
import { AuthGuard } from './Core/Interceptors/auth.guard';
import { EmailTemplatesComponent } from './Components/Admin/email-templates/email-templates.component';
import { UpdateEmailTemplateComponent } from './Components/Admin/update-email-template/update-email-template.component';
import { EmailLogComponent } from './Components/Admin/email-log/email-log.component';
import { AdminRegistrationDetailsComponent } from './Components/Admin/admin-registration-details/admin-registration-details.component';
import { AddEmailTemplateComponent } from './Components/Admin/add-email-template/add-email-template.component';
import { ContactListService } from './Services/contact-list.service';
import { ContactListsComponent } from './Components/Admin/contact-lists/contact-lists.component';

export const routes: Routes = [
    { path: '', component: RegisterMemberComponent },
    { path: 'registration-details/:uid', component: RegistrationDetailsComponent },
    { path: 'admin-registration-details/:uid', component: AdminRegistrationDetailsComponent,canActivate: [AuthGuard] },
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
    },
    {
        path: 'add-email-template',
        component: AddEmailTemplateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'contact-lists',
        component: ContactListsComponent,
        canActivate: [AuthGuard]
    }

];
