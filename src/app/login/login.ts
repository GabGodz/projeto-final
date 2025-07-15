import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (this.auth.login(username, password)) {
        this.router.navigate(['/home']);
      } else {
        this.loginError = true;
      }
    }
  }
}
