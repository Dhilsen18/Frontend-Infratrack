import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigurationStore {
  readonly theftDropAlertsEnabled = signal(true);
  readonly dailyEmailDigestEnabled = signal(false);

  setTheftDropAlertsEnabled(value: boolean): void {
    this.theftDropAlertsEnabled.set(value);
  }

  setDailyEmailDigestEnabled(value: boolean): void {
    this.dailyEmailDigestEnabled.set(value);
  }
}
