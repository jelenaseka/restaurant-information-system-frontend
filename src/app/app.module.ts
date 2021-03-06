import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { WaiterHomepageComponent } from './waiter/waiter-homepage/waiter-homepage.component';
import { MaterialModule } from './core/material.module';
import { AuthService } from './autentification/services/auth.service';
import { JwtDecoderService } from './autentification/services/jwt-decoder.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role-guard';
import { HeaderInterceptorService } from './autentification/services/header-interceptor.service';
import { HeaderComponent } from './registered/header/header.component';
import { EmployeesComponent } from './manager/employees/employees.component';
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
import { RestaurantViewComponent } from './admin/restaurant-view/restaurant-view.component';
import { RoomnameDialogComponent } from './admin/roomname-dialog/roomname-dialog/roomname-dialog.component';
import { RoomSpaceComponent } from './admin/room-space/room-space.component';
import { EditRoomDialogComponent } from './admin/edit-room-dialog/edit-room-dialog.component';
import { WorkersComponent } from './system-admin/workers/workers.component';
import { MenuComponent } from './system-admin/menu/menu.component';
import { AdministratorsComponent } from './admin/administrators/administrators.component';
import { WorkersTableComponent } from './system-admin/workers-table/workers-table.component';
import { ChangePasswordDialogComponent } from './system-admin/change-password-dialog/change-password-dialog.component';
import { ReportHomepageComponent } from './reports/report-homepage/report-homepage.component';
import { BarChartComponent } from './reports/charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './reports/charts/line-chart/line-chart.component';
import { MenuItemDialogComponent } from './system-admin/menu-item-dialog/menu-item-dialog.component';
import { AddRegisteredUserDialogComponent } from './registered/add-registered-user-dialog/add-registered-user-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    WaiterHomepageComponent,
    HeaderComponent,
    EmployeesComponent,
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
    RestaurantViewComponent,
    RoomnameDialogComponent,
    RoomSpaceComponent,
    EditRoomDialogComponent,
    ReportHomepageComponent,
    WorkersComponent,
    MenuComponent,
    AdministratorsComponent,
    WorkersTableComponent,
    ChangePasswordDialogComponent,
    AddRegisteredUserDialogComponent,
    BarChartComponent,
    LineChartComponent,
    MenuItemDialogComponent,
  ],
  imports: [
    BrowserModule,
    DxChartModule,
    DxSelectBoxModule,
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
