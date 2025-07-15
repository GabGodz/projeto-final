import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { adminGuard } from './admin-guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { 
    path: 'admin-panel', 
    loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
    canActivate: [adminGuard]
  },
  { 
    path: 'product-description-generator', 
    loadChildren: () => import('./product-description-generator/product-description-generator.module').then(m => m.ProductDescriptionGeneratorModule),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
