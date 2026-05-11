import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

import { ConfigurationStore } from '../../application/configuration.store';

@Component({
  selector: 'app-configuration-view',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatSlideToggle, MatButton, TranslatePipe],
  templateUrl: './configuration-view.html',
  styleUrl: './configuration-view.css',
})
export class ConfigurationView {
  protected readonly store = inject(ConfigurationStore);

  onTheftToggle(checked: boolean): void {
    this.store.setTheftDropAlertsEnabled(checked);
  }

  onDigestToggle(checked: boolean): void {
    this.store.setDailyEmailDigestEnabled(checked);
  }
}
