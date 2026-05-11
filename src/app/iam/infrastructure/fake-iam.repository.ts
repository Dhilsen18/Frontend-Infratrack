import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

import { IamSession } from '../domain/model/session.model';
import { IamRepository, SignInCredentials } from '../domain/ports/iam.repository';

/**
 * Simulates IAM HTTP latency and responses. Swap {@link IAM_REPOSITORY} in app config
 * for an HTTP implementation when the backend is available.
 */
@Injectable()
export class FakeIamRepository implements IamRepository {
  private static readonly latencyMs = 450;

  signIn(credentials: SignInCredentials): Observable<IamSession> {
    const username = credentials.username.trim();
    if (!username) {
      return throwError(() => new Error('IAM_SIGN_IN_INVALID'));
    }
    const session: IamSession = { username, loggedInAt: Date.now() };
    return of(session).pipe(delay(FakeIamRepository.latencyMs));
  }
}
