import { Injectable, signal } from '@angular/core';

import { EfficiencySnapshot } from '../domain/model/efficiency-snapshot.model';

@Injectable({ providedIn: 'root' })
export class PerformanceStore {
  readonly snapshot = signal<EfficiencySnapshot>({
    excessiveIdleSharePercent: 18,
    topOperatorEfficiencyPercent: 92,
    fuelVarianceVersusPlanPercent: -4.2,
  });

  simulateSample(): void {
    this.snapshot.set({
      excessiveIdleSharePercent: Math.round(12 + Math.random() * 14),
      topOperatorEfficiencyPercent: Math.round(85 + Math.random() * 12),
      fuelVarianceVersusPlanPercent: Math.round((Math.random() * 10 - 6) * 10) / 10,
    });
  }
}
