import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../Services/auth.service';
import { User } from '../../../Models/user';
import { Role } from '../../../Models/roles';
// import url('https://rsms.me/inter/inter.css');

@Component({
    selector: 'app-header',
    imports: [FontAwesomeModule, RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  faBell = faBell;
  constructor(public authService: AuthService, private router: Router) {}

  userProfilePictureUrl = '../../../assets/profile.jpg';
  userName = 'Zakir';
  isAuthenticated!: boolean;
  isStoreAuthenticated!:boolean
  isLoginPage!: boolean;
  user!: User;
  role!:Role;
  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this.router.events.subscribe((val: any) => {
      this.isLoginPage =
        this.router.url.includes('login') ||
        this.router.url=="/"||
        this.router.url.includes('registration-details')
      if (this.authService.isAuthenticated() != null && this.authService.getUserData()!=null) {
     
        var user = this.authService.getUserData();
        this.role=user.role||{};
        this.userName = user.firstName || '';
        this.isAuthenticated = true;
      } 
      else{
        this.isAuthenticated = false;
      }
    });
  }
  Logout() {
    this.authService.logout();
  }
}
