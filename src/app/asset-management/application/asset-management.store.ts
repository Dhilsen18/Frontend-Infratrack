import { computed, Injectable, signal } from '@angular/core';

import { Machine } from '../domain/model/machine.entity';

const SEED: Machine[] = [
  {
    machineId: 'MCH-01',
    machineName: 'Excavator EX-02',
    operationalStatus: 'active',
    fuelLevel: 'high',
    locationLabel: 'SITE A — Block 4',
  },
  {
    machineId: 'MCH-02',
    machineName: 'Loader LD-07',
    operationalStatus: 'warning',
    fuelLevel: 'medium',
    locationLabel: 'SITE D — Block 1',
  },
  {
    machineId: 'MCH-03',
    machineName: 'Crane CR-04',
    operationalStatus: 'idle',
    fuelLevel: 'low',
    locationLabel: 'SITE B — Yard',
  },
  {
    machineId: 'MCH-04',
    machineName: 'Bulldozer BD-11',
    operationalStatus: 'resolved',
    fuelLevel: 'warning',
    locationLabel: 'SITE C — Access road',
  },
];

const EXTRAS: Machine[] = Array.from({ length: 32 }, (_, i) => {
  const n = i + 5;
  return {
    machineId: `MCH-${String(n).padStart(2, '0')}`,
    machineName: `Unit U-${n}`,
    operationalStatus: 'active' as const,
    fuelLevel: 'high' as const,
    locationLabel: `SITE ${String.fromCharCode(65 + (i % 5))} — Sector ${(i % 4) + 1}`,
  };
});

const ALL_MACHINES: Machine[] = [...SEED, ...EXTRAS];

@Injectable({ providedIn: 'root' })
export class AssetManagementStore {
  private readonly pageIndex = signal(0);
  private readonly pageSize = signal(10);

  readonly totalCount = ALL_MACHINES.length;

  readonly pageIndexValue = computed(() => this.pageIndex());
  readonly pageSizeValue = computed(() => this.pageSize());

  readonly page = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return ALL_MACHINES.slice(start, start + this.pageSize());
  });

  readonly range = computed(() => {
    const from = this.pageIndex() * this.pageSize() + 1;
    const to = Math.min((this.pageIndex() + 1) * this.pageSize(), ALL_MACHINES.length);
    return { from, to, total: ALL_MACHINES.length };
  });

  setPage(index: number, size: number): void {
    this.pageIndex.set(index);
    this.pageSize.set(size);
  }
}
