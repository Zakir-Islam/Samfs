import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Interceptors/auth.guard';
// Components are now lazy loaded

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./Components/PublicPages/register-member/register-member.component').then(m => m.RegisterMemberComponent)
    },
    {
        path: 'registration-details/:uid',
        loadComponent: () => import('./Components/PublicPages/registration-details/registration-details.component').then(m => m.RegistrationDetailsComponent)
    },
    {
        path: 'member-attachments/:uid',
        loadComponent: () => import('./Components/PublicPages/member-attachments/member-attachments.component').then(m => m.MemberAttachmentsComponent)
    },
    {
        path: 'admin-registration-details/:uid',
        loadComponent: () => import('./Components/Admin/admin-registration-details/admin-registration-details.component').then(m => m.AdminRegistrationDetailsComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./Components/PublicPages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'list-members',
        loadComponent: () => import('./Components/Admin/list-members/list-members.component').then(m => m.ListMembersComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'email-templates',
        loadComponent: () => import('./Components/Admin/email-templates/email-templates.component').then(m => m.EmailTemplatesComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'update-email-template/:id',
        loadComponent: () => import('./Components/Admin/update-email-template/update-email-template.component').then(m => m.UpdateEmailTemplateComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'email-logs/:recordId',
        loadComponent: () => import('./Components/Admin/email-log/email-log.component').then(m => m.EmailLogComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'add-email-template',
        loadComponent: () => import('./Components/Admin/add-email-template/add-email-template.component').then(m => m.AddEmailTemplateComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'contact-lists',
        loadComponent: () => import('./Components/Admin/contact-lists/contact-lists.component').then(m => m.ContactListsComponent),
        canActivate: [AuthGuard]
    }
];
