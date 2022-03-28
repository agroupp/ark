import { InjectionToken } from '@angular/core';

export const ARK_REGISTRY_CONFIG = new InjectionToken<ArkRegistryConfig>('__ARK_REGISTRY_CONFIG__');

export interface ArkRegistryConfig {
  isDebugMode: boolean;
}
