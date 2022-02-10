import { Injectable } from '@angular/core';
import { map, of, Observable, delay } from 'rxjs';

import { Credentials } from './credentials';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  login(credentials: Credentials): Observable<LoginResponse> {
    return of(credentials).pipe(
      delay(1000),
      map(c => {
        if (c.password !== 'qqq') {
          throw new Error('Bad password');
        }

        return { email: c.email, token: 'DUMMY_TOKEN' + Date.now() };
      }),
    );
  }
}
