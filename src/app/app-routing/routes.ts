import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { LoginComponent } from '../login/login/login.component';
import { WaiterHomepageComponent } from '../waiter/waiter-homepage/waiter-homepage.component';
import { ManagerHomepageComponent } from '../manager/manager-homepage/manager-homepage.component';
import { AdminHomepageComponent } from '../admin/admin-homepage/admin-homepage.component';
import { SystemAdminHomepageComponent } from '../system-admin/system-admin-homepage/system-admin-homepage.component';
import { ManagerAuthGuard } from '../guards/manager-auth.guard';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { SystemAdminAuthGuard } from '../guards/system-admin-auth.guard';
import { LoginManagerAuthGuard } from '../guards/login-manager-auth.guard';
import { LoginAdminAuthGuard } from '../guards/login-admin-auth.guard';
import { LoginSystemAdminAuthGuard } from '../guards/login-system-admin-auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      LoginManagerAuthGuard,
      LoginAdminAuthGuard,
      LoginSystemAdminAuthGuard,
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginManagerAuthGuard,
      LoginAdminAuthGuard,
      LoginSystemAdminAuthGuard,
    ],
  },
  { path: 'home/waiter', component: WaiterHomepageComponent },
  {
    path: 'home/manager',
    component: ManagerHomepageComponent,
    canActivate: [ManagerAuthGuard],
  },
  {
    path: 'home/admin',
    component: AdminHomepageComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'home/system-admin',
    component: SystemAdminHomepageComponent,
    canActivate: [SystemAdminAuthGuard],
  },
];
