import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IamSession } from '../domain/model/session.model';
import { IamRepository, SignInCredentials } from '../domain/ports/iam.repository';

/**
 * IAM over HTTP (Firebase Cloud Functions in prod, or emulators + `proxy.conf.json` in dev).
 */
@Injectable()
export class HttpIamRepository implements IamRepository {
  private readonly http = inject(HttpClient);

  signIn(credentials: SignInCredentials): Observable<IamSession> {
    const base = environment.apiBaseUrl.replace(/\/$/, '');
    const url = `${base}/api/v1/iam/sign-in`;
    return this.http.post<IamSession>(url, credentials);
  }
}
