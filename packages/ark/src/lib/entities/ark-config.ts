import { InjectionToken } from '@angular/core';

export const ARK_CONFIG = new InjectionToken<ArkConfig>('__ARK_CONFIG__');

export interface ArkConfig {
  name: string;
}
