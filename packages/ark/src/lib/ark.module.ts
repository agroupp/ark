import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ArkRegistryConfig, ARK_REGISTRY_CONFIG } from './entities';
import { ArkRegistryService } from './infrastructure';

@NgModule({
  imports: [CommonModule],
})
export class ArkModule {
  static configure(config?: ArkRegistryConfig): ModuleWithProviders<ArkModule> {
    return {
      ngModule: ArkModule,
      providers: [{ provide: ARK_REGISTRY_CONFIG, useValue: config }],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  constructor(registry: ArkRegistryService) {}
}
