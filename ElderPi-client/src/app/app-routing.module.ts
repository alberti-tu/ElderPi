import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthenticationService} from './service/authentication.service';

import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { UserComponent } from './pages/user/user.component';
import { SensorComponent } from './pages/sensor/sensor.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main',  component: MainComponent, canActivate: [AuthenticationService] },
  { path: 'user',  component: UserComponent, canActivate: [AuthenticationService] },
  { path: 'sensor', component: SensorComponent, canActivate: [AuthenticationService] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthenticationService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
