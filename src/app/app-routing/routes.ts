import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { LoginComponent } from '../login/login/login.component';
import { WaiterHomepageComponent } from '../waiter/waiter-homepage/waiter-homepage.component';
import { ManagerHomepageComponent } from '../manager/manager-homepage/manager-homepage.component';
import { AdminHomepageComponent } from '../admin/admin-homepage/admin-homepage.component';
import { SystemAdminHomepageComponent } from '../system-admin/system-admin-homepage/system-admin-homepage.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role-guard';
import { BartenderHomepageComponent } from '../bartender/bartender-homepage/bartender-homepage.component';
import { ChefHomepageComponent } from '../chef/chef-homepage/chef-homepage.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home/waiter', component: WaiterHomepageComponent, canActivate: [AuthGuard], },
  { path: 'home/bartender', component: BartenderHomepageComponent, canActivate: [AuthGuard], },
  { path: 'home/chef', component: ChefHomepageComponent, canActivate: [AuthGuard], },
  {
    path: 'home/manager',
    component: ManagerHomepageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'MANAGER' } 
  },
  {
    path: 'home/admin',
    component: AdminHomepageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ADMIN' } 
  },
  {
    path: 'home/system-admin',
    component: SystemAdminHomepageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'SYSTEM_ADMIN' } 
  },
  { path: '**', redirectTo: '/home' },
];
