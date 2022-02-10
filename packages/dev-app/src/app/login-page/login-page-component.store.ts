import { Injectable } from '@angular/core';
import { Ark, StateBase } from '@groupp/ark';

export type LoginPageComponentState = StateBase;

@Injectable()
export class LoginPageComponentStore extends Ark<LoginPageComponentState> {
  constructor() {
    super({});
  }
}
