import { computed, Injectable, signal } from '@angular/core';

import { DashboardAlert } from '../domain/model/dashboard-alert.model';
import { FleetKpi, FleetKpiId } from '../domain/model/fleet-kpi.model';

@Injectable({ providedIn: 'root' })
export class ControlPanelStore {
  private readonly kpisSignal = signal<FleetKpi[]>([
    { id: 'activeMachines', value: '24', icon: 'precision_manufacturing' },
    { id: 'fuelAlerts', value: '3', icon: 'local_gas_station' },
    { id: 'idleMachines', value: '7', icon: 'hourglass_empty' },
    { id: 'efficiencyRate', value: '87%', icon: 'trending_up' },
  ]);

  private readonly alertsSignal = signal<DashboardAlert[]>([
    {
      timeAgo: '12 min ago',
      machineName: 'Excavator EX-02',
      alertType: 'Low fuel warning',
      severity: 'warning',
      status: 'active',
    },
    {
      timeAgo: '45 min ago',
      machineName: 'Loader LD-07',
      alertType: 'Engine temperature high',
      severity: 'critical',
      status: 'active',
    },
    {
      timeAgo: '2 h ago',
      machineName: 'Crane CR-04',
      alertType: 'Idle threshold exceeded',
      severity: 'warning',
      status: 'resolved',
    },
  ]);

  private readonly selectedKpiSignal = signal<FleetKpiId | null>('activeMachines');

  readonly kpis = computed(() => this.kpisSignal());
  readonly alerts = computed(() => this.alertsSignal());
  readonly selectedKpiId = computed(() => this.selectedKpiSignal());

  selectKpi(id: FleetKpiId): void {
    this.selectedKpiSignal.set(id);
  }
}
