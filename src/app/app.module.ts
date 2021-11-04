import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { WaiterHomepageComponent } from './waiter/waiter-homepage/waiter-homepage.component';
import { MaterialModule } from './core/material.module';
import { AuthService } from './services/auth.service';
import { ManagerHomepageComponent } from './manager/manager-homepage/manager-homepage.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { SystemAdminHomepageComponent } from './system-admin/system-admin-homepage/system-admin-homepage.component';
import { ManagerAuthGuard } from './guards/manager-auth.guard';
import { JwtDecoderService } from './services/jwt-decoder.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { SystemAdminAuthGuard } from './guards/system-admin-auth.guard';
import { LoginManagerAuthGuard } from './guards/login-manager-auth.guard';
import { LoginAdminAuthGuard } from './guards/login-admin-auth.guard';
import { LoginSystemAdminAuthGuard } from './guards/login-system-admin-auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    WaiterHomepageComponent,
    ManagerHomepageComponent,
    AdminHomepageComponent,
    SystemAdminHomepageComponent,
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
    ManagerAuthGuard,
    JwtDecoderService,
    AdminAuthGuard,
    SystemAdminAuthGuard,
    LoginManagerAuthGuard,
    LoginAdminAuthGuard,
    LoginSystemAdminAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
