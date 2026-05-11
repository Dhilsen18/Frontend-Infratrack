import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

import { PerformanceStore } from '../../application/performance.store';

@Component({
  selector: 'app-performance-view',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, TranslatePipe],
  templateUrl: './performance-view.html',
  styleUrl: './performance-view.css',
})
export class PerformanceView {
  protected readonly store = inject(PerformanceStore);

  randomize(): void {
    this.store.simulateSample();
  }
}
