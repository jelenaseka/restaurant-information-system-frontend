import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { WaiterHomepageComponent } from './waiter/waiter-homepage/waiter-homepage.component';
import { MaterialModule } from './core/material.module';
import { AuthService } from './autentification/services/auth.service';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { SystemAdminHomepageComponent } from './system-admin/system-admin-homepage/system-admin-homepage.component';
import { JwtDecoderService } from './autentification/services/jwt-decoder.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role-guard';
import { HeaderInterceptorService } from './autentification/services/header-interceptor.service';
import { HeaderComponent } from './registered/header/header.component';
import { EmployeesComponent } from './manager/employees/employees.component';
import { EmployeesTableComponent } from './manager/employees-table/employees-table.component';
import { ReportComponent } from './manager/report/report.component';
import { BartenderHomepageComponent } from './bartender/bartender-homepage/bartender-homepage.component';
import { HeaderComponent as UnregisteredHeader } from './unregistered/header/header.component';
import { ChefHomepageComponent } from './chef/chef-homepage/chef-homepage.component';
import { ItemListComponent } from './unregistered/item-list/item-list.component';
import { ItemComponent } from './unregistered/item/item.component';
import { ItemDetailsComponent } from './unregistered/item-details/item-details.component';
import { DrinkItemsService } from './bartender/services/drink-items.service';
import { PincodeDialogComponent } from './unregistered/pincode-dialog/pincode-dialog.component';
import { AddEmployeeDialogComponent } from './manager/add-employee-dialog/add-employee-dialog.component';
import { TableDetailsComponent } from './waiter/table-details/table-details.component';
import { OrderItemDialogComponent } from './waiter/order-item-dialog/order-item-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    WaiterHomepageComponent,
    AdminHomepageComponent,
    SystemAdminHomepageComponent,
    HeaderComponent,
    EmployeesComponent,
    EmployeesTableComponent,
    ReportComponent,
    BartenderHomepageComponent,
    HeaderComponent,
    UnregisteredHeader,
    ChefHomepageComponent,
    ItemListComponent,
    ItemComponent,
    ItemDetailsComponent,
    PincodeDialogComponent,
    AddEmployeeDialogComponent,
    TableDetailsComponent,
    OrderItemDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    JwtDecoderService,
    AuthGuard,
    RoleGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true },
    DrinkItemsService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
