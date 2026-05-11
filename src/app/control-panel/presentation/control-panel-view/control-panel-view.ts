import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { debounceTime, fromEvent } from 'rxjs';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ControlPanelStore } from '../../application/control-panel.store';
import { FleetKpiId } from '../../domain/model/fleet-kpi.model';

@Component({
  selector: 'app-control-panel-view',
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
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './control-panel-view.html',
  styleUrl: './control-panel-view.css',
})
export class ControlPanelView {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapHost = viewChild<ElementRef<HTMLElement>>('mapHost');

  protected readonly store = inject(ControlPanelStore);

  protected readonly alertColumns = ['timeAgo', 'machineName', 'alertType', 'severity', 'status'] as const;

  private map?: L.Map;
  private markerBindings: { layer: L.CircleMarker; titleKey: string; bodyKey: string }[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.map?.remove();
      this.map = undefined;
      this.markerBindings = [];
    });

    afterNextRender(() => {
      this.initMap();
      this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.refreshMapPopups();
      });

      fromEvent(window, 'resize')
        .pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.invalidateMapSize());
    });
  }

  selectKpi(id: FleetKpiId): void {
    this.store.selectKpi(id);
  }

  isSelected(id: FleetKpiId): boolean {
    return this.store.selectedKpiId() === id;
  }

  private popupHtml(titleKey: string, bodyKey: string): string {
    const title = this.translate.instant(titleKey);
    const body = this.translate.instant(bodyKey);
    return `<div class="it-map-popup"><strong>${title}</strong><br/><span class="it-map-popup__body">${body}</span></div>`;
  }

  private initMap(): void {
    const el = this.mapHost()?.nativeElement;
    if (!el || this.map) {
      return;
    }

    const map = L.map(el, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([-12.0727, -77.0356], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(map);
    this.map = map;

    map.whenReady(() => this.scheduleMapResize());

    const markers: {
      latLng: L.LatLngTuple;
      stroke: string;
      fill: string;
      titleKey: string;
      bodyKey: string;
    }[] = [
      {
        latLng: [-12.065, -77.028],
        stroke: '#a16207',
        fill: '#facc15',
        titleKey: 'controlPanel.map.markers.activeTitle',
        bodyKey: 'controlPanel.map.markers.activeBody',
      },
      {
        latLng: [-12.078, -77.042],
        stroke: '#b45309',
        fill: '#facc15',
        titleKey: 'controlPanel.map.markers.warningTitle',
        bodyKey: 'controlPanel.map.markers.warningBody',
      },
      {
        latLng: [-12.082, -77.018],
        stroke: '#475569',
        fill: '#94a3b8',
        titleKey: 'controlPanel.map.markers.idleTitle',
        bodyKey: 'controlPanel.map.markers.idleBody',
      },
    ];

    for (const m of markers) {
      const layer = L.circleMarker(m.latLng, {
        radius: 12,
        color: m.stroke,
        weight: 2,
        fillColor: m.fill,
        fillOpacity: 0.95,
      }).addTo(map);
      layer.bindPopup(this.popupHtml(m.titleKey, m.bodyKey));
      this.markerBindings.push({ layer, titleKey: m.titleKey, bodyKey: m.bodyKey });
    }

    this.scheduleMapResize();
  }

  private scheduleMapResize(): void {
    const map = this.map;
    if (!map) {
      return;
    }
    const run = () => map.invalidateSize({ animate: false });
    queueMicrotask(run);
    requestAnimationFrame(run);
    setTimeout(run, 120);
    setTimeout(run, 400);
  }

  private invalidateMapSize(): void {
    this.scheduleMapResize();
  }

  private refreshMapPopups(): void {
    for (const m of this.markerBindings) {
      m.layer.setPopupContent(this.popupHtml(m.titleKey, m.bodyKey));
    }
  }
}
