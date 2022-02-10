import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { SessionFacade } from '../session/session.facade';
import { LoginPageComponentStore } from './login-page-component.store';

@Component({
  selector: 'ark-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [LoginPageComponentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly form = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });
  readonly vm$ = this.store.select();

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: LoginPageComponentStore,
    private readonly router: Router,
    readonly sessionFacade: SessionFacade,
  ) {
    sessionFacade.loading$.subscribe(loading => store.setLoadingState(loading));
    sessionFacade.error$.subscribe(error => store.setErrorState(error));
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => store.setErrorState(undefined));
    sessionFacade.loggedin$.subscribe(loggedin => (loggedin ? this.router.navigate(['']) : null));
  }

  login(): void {
    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')?.value?.trim().toLowerCase();
    const password = this.form.get('password')?.value?.trim();
    this.sessionFacade.login({ email, password });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
