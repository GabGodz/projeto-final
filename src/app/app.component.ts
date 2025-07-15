import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Auth } from './auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'projeto-final-recuperado';
  showNavbar = false;
  currentRoute = '';

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      // Don't show navbar on login page
      this.showNavbar = !event.url.includes('/login');
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  isAdmin() {
    return this.auth.hasRole('admin');
  }
}
