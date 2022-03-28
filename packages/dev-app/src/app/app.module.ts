import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ArkModule } from '@groupp/ark';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: MainPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [AppComponent, LoginPageComponent, MainPageComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ArkModule.configure({ isDebugMode: !environment.production }),
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
