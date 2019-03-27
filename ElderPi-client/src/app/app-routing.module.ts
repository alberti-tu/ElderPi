import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { SensorComponent } from './components/sensor/sensor.component';
import { AuthenticationService } from './service/authentication.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main',  component: MainComponent, canActivate: [AuthenticationService] },
  { path: 'sensor', component: SensorComponent, canActivate: [AuthenticationService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
