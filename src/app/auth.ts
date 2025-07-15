import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private authenticated = false;
  private userRole = '';

  constructor() {
    // Check if user is already authenticated from a previous session
    const authStatus = localStorage.getItem('authenticated');
    const role = localStorage.getItem('userRole');
    
    if (authStatus === 'true' && role) {
      this.authenticated = true;
      this.userRole = role;
    }
  }

  login(username: string, password: string): boolean {
    // For demo purposes only - in a real app, this would validate against a backend
    if ((username === 'admin' && password === 'admin') || (username === 'admin' && password === '123456')) {
      this.authenticated = true;
      this.userRole = 'admin';
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      return true;
    } else if ((username === 'user' && password === 'user') || (username === 'user' && password === '123456')) {
      this.authenticated = true;
      this.userRole = 'user';
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', 'user');
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticated = false;
    this.userRole = '';
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getUserRole(): string {
    return this.userRole;
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }
}
