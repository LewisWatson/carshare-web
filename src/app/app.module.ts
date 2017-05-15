import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JsonApiModule } from 'angular2-jsonapi';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthService } from './auth/services/auth.service';
import { DataStoreService} from './data-store.service';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CarShareModule } from './car-share/car-share.module';

import 'hammerjs';

const firebaseAppConfig = {
  apiKey: "AIzaSyCf8me1ihwXzJU3GJTxI4TtF1uo_gfmStU",
  authDomain: "ridesharelogger.com",
  databaseURL: "https://ridesharelogger.firebaseio.com",
  storageBucket: "ridesharelogger.appspot.com",
  messagingSenderId: "549212301269",
  projectId: "ridesharelogger",
};

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    UserDetailComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    JsonApiModule,
    MaterialModule,
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireAuthModule,
    AuthModule,
    CarShareModule,
    AppRoutingModule
  ],
  providers: [DataStoreService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
