import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { DataStoreService } from '../../data-store.service';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  private user: firebase.User;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  constructor(public fAuth: AngularFireAuth, private router: Router, private dataStore: DataStoreService) {

    fAuth.authState.subscribe((user: firebase.User) => {

      console.log('auth state change');

      this.user = user;
      if (user) {

        user.getToken().then(
          function (token) {
            console.log('token ' + token);
            localStorage.setItem('authToken', token);
            this.dataStore.updateAuthToken();
          }.bind(this)
        ).catch(
          function (error) {
            console.log(error);
          }
          );
      }
    });
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  get id(): string {
    return this.authenticated ? this.user.uid : '';
  }

  signInAnonymously(): firebase.Promise<firebase.User> {
    return this.fAuth.auth.signInAnonymously();
  }

  signOut(): void {

    this.fAuth.auth.signOut().then(
      () => this.router.navigate(['/login'])
    )
      .catch(error => console.log('ERROR @ AuthService#signOut() :', error));
  }
}
