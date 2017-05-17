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

    console.log('creating/updating carshare-api user');

    this.dataStoreService.createRecord(User, {
      'firebase-uid': fbUser.uid,
      'email': fbUser.email,
      'is-anon': fbUser.isAnonymous,
      'photo-url': fbUser.photoURL,
      'display-name': fbUser.displayName,
    }).save().subscribe(
      (user: User) => {
        console.log('sucessfully created/updated carshare-api user');
        this.redirect();
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

  private redirect(): void {

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
