import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetManagementStore } from '../../application/asset-management.store';

@Component({
  selector: 'app-asset-management-view',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    TranslatePipe,
  ],
  templateUrl: './asset-management-view.html',
  styleUrl: './asset-management-view.css',
})
export class AssetManagementView {
  protected readonly store = inject(AssetManagementStore);

  protected readonly columns = ['machineId', 'machineName', 'operationalStatus', 'fuelLevel', 'locationLabel'] as const;

  onPage(ev: PageEvent): void {
    this.store.setPage(ev.pageIndex, ev.pageSize);
  }
}
