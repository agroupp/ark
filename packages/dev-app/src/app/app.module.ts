import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

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
  imports: [BrowserModule, ReactiveFormsModule, RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
