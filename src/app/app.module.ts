import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { WaiterHomepageComponent } from './waiter/waiter-homepage/waiter-homepage.component';
import { MaterialModule } from './core/material.module';
import { AuthService } from './autentification/services/auth.service';
import { ManagerHomepageComponent } from './manager/manager-homepage/manager-homepage.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { SystemAdminHomepageComponent } from './system-admin/system-admin-homepage/system-admin-homepage.component';
import { JwtDecoderService } from './autentification/services/jwt-decoder.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role-guard';
import { HeaderInterceptorService } from './autentification/services/header-interceptor.service';
import { BartenderHomepageComponent } from './bartender/bartender-homepage/bartender-homepage.component';
import { HeaderComponent } from './unregistered/header/header.component';
import { ChefHomepageComponent } from './chef/chef-homepage/chef-homepage.component';
import { ItemListComponent } from './unregistered/item-list/item-list.component';
import { ItemComponent } from './unregistered/item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    WaiterHomepageComponent,
    ManagerHomepageComponent,
    AdminHomepageComponent,
    SystemAdminHomepageComponent,
    BartenderHomepageComponent,
    HeaderComponent,
    ChefHomepageComponent,
    ItemListComponent,
    ItemComponent,
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
  ],
  providers: [
    AuthService,
    JwtDecoderService,
    AuthGuard,
    RoleGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
