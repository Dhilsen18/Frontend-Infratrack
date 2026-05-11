import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { IamSession } from '../model/session.model';

export interface SignInCredentials {
  username: string;
  password: string;
}

export interface IamRepository {
  signIn(credentials: SignInCredentials): Observable<IamSession>;
}

export const IAM_REPOSITORY = new InjectionToken<IamRepository>('IAM_REPOSITORY');
