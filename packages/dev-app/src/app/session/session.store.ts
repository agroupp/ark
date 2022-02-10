import { Injectable } from '@angular/core';
import { Ark, StateBase } from '@groupp/ark';

export interface SessionState extends StateBase {
  userEmail?: string;
  token?: string;
}

function createInitialState(): SessionState {
  return {};
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends Ark<SessionState> {
  constructor() {
    super(createInitialState(), { name: SessionStore.name });
  }
}
