import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationService } from './service/authentication.service';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';
import { SensorComponent } from './components/sensor/sensor.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main',  component: MainComponent, canActivate: [AuthenticationService] },
  { path: 'user',  component: UserComponent, canActivate: [AuthenticationService] },
  { path: 'sensor', component: SensorComponent, canActivate: [AuthenticationService] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthenticationService] },

  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
