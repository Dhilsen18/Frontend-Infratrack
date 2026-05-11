import { filter } from 'rxjs';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IamService } from '../../../../iam/application/iam.service';
import { Footer } from '../footer/footer';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

const PATH_TO_NAV: Record<string, string> = {
  'control-panel': 'nav.controlPanel',
  'asset-management': 'nav.assetManagement',
  telemetry: 'nav.telemetry',
  'reports-analytics': 'nav.reportsAnalytics',
  performance: 'nav.performance',
  configuration: 'nav.configuration',
};

@Component({
  selector: 'app-shell-layout',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatToolbar,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatIcon,
    MatIconButton,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    RouterOutlet,
    TranslatePipe,
    LanguageSwitcher,
    Footer,
  ],
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.css',
})
export class ShellLayout {
  private readonly router = inject(Router);
  protected readonly iam = inject(IamService);
  private readonly snack = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  protected readonly sidenavOpen = signal(true);
  protected readonly sectionNavKey = signal('nav.controlPanel');
  protected searchQuery = '';

  protected readonly navItems = [
    { path: '/control-panel', icon: 'dashboard', labelKey: 'nav.controlPanel' },
    { path: '/asset-management', icon: 'precision_manufacturing', labelKey: 'nav.assetManagement' },
    { path: '/telemetry', icon: 'sensors', labelKey: 'nav.telemetry' },
    { path: '/reports-analytics', icon: 'insert_chart', labelKey: 'nav.reportsAnalytics' },
    { path: '/performance', icon: 'insights', labelKey: 'nav.performance' },
    { path: '/configuration', icon: 'settings', labelKey: 'nav.configuration' },
  ] as const;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.syncSectionFromUrl(e.urlAfterRedirects));
    this.syncSectionFromUrl(this.router.url);
  }

  toggleSidenav(): void {
    this.sidenavOpen.update((v) => !v);
  }

  emergency(): void {
    this.snack.open(this.translate.instant('common.demoEmergency'), undefined, { duration: 3200 });
  }

  submitSearch(): void {
    this.snack.open(this.translate.instant('common.demoSearch'), undefined, { duration: 2800 });
  }

  logout(): void {
    this.iam.logout();
    void this.router.navigateByUrl('/login');
  }

  navigate(path: string): void {
    void this.router.navigateByUrl(path);
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  private syncSectionFromUrl(url: string): void {
    const path = url.split('?')[0].split('/').filter(Boolean)[0] ?? 'control-panel';
    this.sectionNavKey.set(PATH_TO_NAV[path] ?? 'nav.controlPanel');
  }
}
