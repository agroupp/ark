import { Inject, Injectable, Optional } from '@angular/core';

import { WindowRegistry, ArkRegistryConfig, ARK_REGISTRY_CONFIG } from '../entities';

@Injectable({
  providedIn: 'root',
})
export class ArkRegistryService {
  private readonly registry: WindowRegistry;

  constructor(@Optional() @Inject(ARK_REGISTRY_CONFIG) private readonly config?: ArkRegistryConfig) {
    if (!window.__ARK_REGISTRY__ || typeof window.__ARK_REGISTRY__ !== 'object') {
      window.__ARK_REGISTRY__ = new WindowRegistry();
    }

    this.registry = window.__ARK_REGISTRY__;
    this.registry.stateChanged$.subscribe(changes => {
      if (config?.isDebugMode) {
        console.log(changes);
      }
    });
  }

  resetAll(): void {
    for (const [, ark] of this.registry.entries()) {
      ark.reset();
    }
  }
}
