/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs';

import { Ark } from '../infrastructure';

declare global {
  interface Window {
    __ARK_REGISTRY__: WindowRegistry;
  }
}

export type WindowRegistryAction = 'register' | 'unregister';

export interface WindowRegistryState {
  action: WindowRegistryAction;
  id: string;
  name?: string;
}

export class WindowRegistry extends Map<string, Ark<any>> {
  private readonly stateChangedSubject$ = new Subject<WindowRegistryState>();
  readonly stateChanged$ = this.stateChangedSubject$.asObservable();

  register(ark: Ark<any>): void {
    if (this.has(ark.id)) {
      return;
    }

    this.stateChangedSubject$.next({ action: 'register', id: ark.id, name: ark.name });
    this.set(ark.id, ark);
  }

  unregister(id: string): void {
    if (!this.has(id)) {
      return;
    }

    this.stateChangedSubject$.next({ action: 'unregister', id, name: this.get(id)?.name });
    this.delete(id);
  }
}
