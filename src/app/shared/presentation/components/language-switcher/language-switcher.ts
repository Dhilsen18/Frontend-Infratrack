import { Component, OnInit, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'infratrack_lang';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleGroup, MatButtonToggle, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher implements OnInit {
  private readonly translate = inject(TranslateService);

  protected currentLang = 'en';
  protected readonly languages = ['en', 'es'] as const;

  ngOnInit(): void {
    const stored = localStorage.getItem(LANG_KEY);
    const initial =
      stored && this.languages.includes(stored as 'en' | 'es')
        ? stored
        : this.translate.getCurrentLang() || 'en';
    this.currentLang = initial;
    void this.translate.use(initial);
  }

  useLanguage(language: string): void {
    this.currentLang = language;
    localStorage.setItem(LANG_KEY, language);
    void this.translate.use(language);
  }
}
