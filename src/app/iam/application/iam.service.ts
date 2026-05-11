import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { IamSession } from '../domain/model/session.model';
import { IAM_REPOSITORY } from '../domain/ports/iam.repository';

const SESSION_KEY = 'infratrack_session';

@Injectable({ providedIn: 'root' })
export class IamService {
  private readonly repository = inject(IAM_REPOSITORY);
  private readonly session = signal<IamSession | null>(this.readSession());

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly username = computed(() => this.session()?.username ?? null);

  signIn(username: string, _password: string): Observable<boolean> {
    return this.repository.signIn({ username, password: _password }).pipe(
      tap((payload) => this.persistSession(payload)),
      map(() => true),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  private persistSession(payload: IamSession): void {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    this.session.set(payload);
  }

  private readSession(): IamSession | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as IamSession;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
