import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import * as firebase from 'firebase/app';
import { ErrorResponse } from 'angular2-jsonapi';
import { AuthService } from '../../services/auth.service';
import { DataStoreService } from '../../../data-store.service';
import { User } from '../../../user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private titleService: Title,
    private auth: AuthService,
    private router: Router,
    private dataStoreService: DataStoreService) { }

  ngOnInit() {
    this.titleService.setTitle('Sign In');
  }

  signInAnonymously(): void {
    this.auth.signInAnonymously()
      .then((user) => {
        console.log('sucessfully signed in anonymously in firebase');
        this.getAPIUser(user);
      })
      .catch(e => console.error(`Anonymous Login Failure:`, e));
  }

  private getAPIUser(fbUser: firebase.User): void {

    console.log('querying existing carshare-api user');

    this.dataStoreService.query(User, {
      'firebase-uid': fbUser.uid,
    }).subscribe((users: User[]) => {

      if (users.length === 0) {

        console.log('no user found in carshare-api. Creating one')

        this.dataStoreService.createRecord(User, {
          firebaseUID: fbUser.uid,
        }).subscribe(
          (user: User) => {
            console.log('sucessfully created a user in carshare-api');
            this.updateAPIUser(user, fbUser)
          },
          (errorResponse) => {
            if (errorResponse instanceof ErrorResponse) {
              // do something with errorResponse
              console.log('ErrorResponse')
              console.log(errorResponse.errors);
            } else {
              console.log('not error response');
              console.log(errorResponse);
            }
          }
          );
      } else {
        console.log('found existing carshare-api user');
        this.updateAPIUser(users[0], fbUser);
      }

    });
  }

  private updateAPIUser(user: User, fbUser: firebase.User): void {

    console.log('updating carshare-api user with latest information from firebase');

    user.firebaseUID = fbUser.uid;
    user.email = fbUser.email;
    user.isAnon = fbUser.isAnonymous;
    user.photoURL = fbUser.photoURL;
    user.displayName = fbUser.displayName;

    user.save().subscribe(
      (user: User) => {
        console.log('carshare-api user updated');
        this.postUserSync();
      },
      (errorResponse) => {
        if (errorResponse instanceof ErrorResponse) {
          // do something with errorResponse
          console.log('ErrorResponse')
          console.log(errorResponse.errors);
        } else {
          console.log('not error response');
          console.log(errorResponse);
        }
      }
    );
  }

  private postUserSync(): void {

    console.log('succesfully signed in with both firebase and carshare-api. Redirecting user');

    // Get the redirect URL from our auth service
    // If no redirect has been set, use the default
    const redirect = this.auth.redirectUrl ? this.auth.redirectUrl : '/carshares';

    // Set our navigation extras object
    // that passes on our global query params and fragment
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: 'merge',
      preserveFragment: true
    };

    // Redirect the user
    this.router.navigate([redirect], navigationExtras);
  }
}
