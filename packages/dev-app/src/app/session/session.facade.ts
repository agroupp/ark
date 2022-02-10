import { Injectable } from '@angular/core';
import { ArkFacade } from '@groupp/ark';
import { tap, catchError, EMPTY } from 'rxjs';

import { Credentials } from './credentials';
import { SessionService } from './session.service';
import { SessionState, SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionFacade extends ArkFacade<SessionState> {
  readonly loggedin$ = this.store.select(
    state => (state.userEmail && state.token ? { userEmail: state.userEmail, token: state.token } : null),
    ['userEmail', 'token'],
  );

  constructor(private readonly sessionService: SessionService, store: SessionStore) {
    super(store);
  }

  readonly login = this.createEffect<Credentials>((credentials: Credentials) => {
    return this.sessionService.login(credentials).pipe(
      tap(res => this.store.update({ userEmail: res.email, token: res.token })),
      catchError(err => {
        this.store.setErrorState(err);
        return EMPTY;
      }),
    );
  });
}
