import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ErrorHandler } from '@angular/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoginModule } from './core/login/login.module';
import { AnonymousGuardService } from './services/anonymous-guard';
import { AuthGuardService } from './services/auth-guard';
import { InterceptorService } from './services/interceptor.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApiService } from './services/api.service';
import { SharedAlertModule } from './shared/alert/core.module';

// import { AngularFireModule } from '@angular/fire/firebase.app.module';
// import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { firebaseConfig } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FlexLayoutModule,
    NgbModule,
    SharedAlertModule,
    NgSelectModule,
    NgIdleKeepaliveModule.forRoot(),
    LoadingBarRouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 2000,
      preventDuplicates: true,
    }),
    LoginModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
    // AngularFirestoreModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ApiService,
    AuthGuardService,
    AnonymousGuardService,
    // AngularFireAuth,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: ErrorHandler }, //useClass: AppErrorHandler
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
