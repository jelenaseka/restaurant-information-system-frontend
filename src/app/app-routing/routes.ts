import { Routes } from "@angular/router";
import { HomeComponent } from "../home/home/home.component";
import { LoginComponent } from "../login/login/login.component";
import { WaiterHomepageComponent } from "../waiter/waiter-homepage/waiter-homepage.component";

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home/waiter', component: WaiterHomepageComponent }
]