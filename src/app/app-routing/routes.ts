import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { LoginComponent } from '../login/login/login.component';
import { WaiterHomepageComponent } from '../waiter/waiter-homepage/waiter-homepage.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role-guard';
import { EmployeesComponent } from '../manager/employees/employees.component';
import { BartenderHomepageComponent } from '../bartender/bartender-homepage/bartender-homepage.component';
import { ChefHomepageComponent } from '../chef/chef-homepage/chef-homepage.component';
import { ReportHomepageComponent } from '../reports/report-homepage/report-homepage.component';
import { WorkersComponent } from '../system-admin/workers/workers.component';
import { MenuComponent } from '../system-admin/menu/menu.component';
import { RestaurantViewComponent } from '../admin/restaurant-view/restaurant-view.component';
import { AdministratorsComponent } from '../admin/administrators/administrators.component';

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
    path: 'home/manager/employees',
    component: EmployeesComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'MANAGER' },
  },
  {
    path: 'home/manager/report',
    component: ReportHomepageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'MANAGER' },
  },
  {
    path: 'home/admin/restaurant-view',
    component: RestaurantViewComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'home/admin/administrators',
    component: AdministratorsComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'home/system-admin/menu',
    component: MenuComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'SYSTEM_ADMIN' },
  },
  {
    path: 'home/system-admin/workers',
    component: WorkersComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'SYSTEM_ADMIN' },
  },
  {
    path: 'home/system-admin/report',
    component: ReportHomepageComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'SYSTEM_ADMIN' },
  },
  { path: '**', redirectTo: '/home' },
];
