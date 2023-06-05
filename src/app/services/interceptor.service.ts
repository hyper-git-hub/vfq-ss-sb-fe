import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from "rxjs/operators";

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../core/services/auth.service';
import { apiIdentifier, environment } from '../../environments/environment';


@Injectable()

export class InterceptorService implements HttpInterceptor {

  constructor (
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authHeader = localStorage.getItem('token');

    let url = environment.baseUrlSS;
    const baseUrlRA = environment.baseUrlRA;
    const baseUrlDevice = environment.baseUrlDevice;
    const signalR = environment.signalR;
    const bypassurl = '&bypassurl=true';
    const streamingUrl = environment.baseUrlStreaming;
    const inventory = environment.cobInventory;
    
    // Clone the request to add the new header.
    let cloneReq: any;
    if (authHeader != null) {

      let headers = req.headers
        .set("Authorization", "Token " + authHeader)
        .set("User-Platform", "WEB");
        // .set("use-case", useCaseId)


      if (req.url.includes(signalR)
        || req.url.includes(streamingUrl)
        ) {
        cloneReq = req.clone({ url: req.url });
      } else if (req.url.includes(bypassurl)) {
        cloneReq = req.clone({ headers: headers, url: req.url });
      } else if (req.url.includes(inventory)) {
        let headers = req.headers
        .set("Authorization", "Token " + authHeader)
        .set("User-Platform", "WEB")
        .set("consumer-app-secret", "G;6{l?5]V@p5@2~<f%PFJ+W4k@-H?s");

        cloneReq = req.clone({ headers: headers, url: req.url });
      }
      else {
        url = this.getBaseURL(req.url);

        // TODO: Temporary removing token will use else part once building service is completed
        cloneReq = req.clone({ headers: headers, url: url });
        // if (req.url.includes(environment.baseUrlSB)) {
        //   cloneReq = req.clone({url: url });
        // } else {
        // }

      }
    } else {
      url = this.getBaseURL(req.url);
      let headers = req.headers.set("User-Platform", "WEB");
      cloneReq = req.clone({ headers: headers, url: url });
    }

    // Pass on the cloned request instead of the original request.
    return next.handle(cloneReq).pipe(
      tap((event => {
        if (event instanceof HttpResponse) {
          // console.log(event)
        }
      }), (err: any) => {

        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.auth.unsetUser();
          localStorage.removeItem('token');
          this.router.navigateByUrl('');
          // this.toastr.error(err.error.message, '', {
          //   progressBar: true,
          //   progressAnimation: "decreasing",
          //   timeOut: 3000,
          // })
        } else if (err.status === 500) {
          if (!req.url.includes('https://staging.gateway.iot.vodafone.com.qa/live-stream/camera/stream')) {
            this.toastr.error('Something went wrong', '', {
              progressBar: true,
              progressAnimation: "decreasing",
              timeOut: 3000,
            })
          }
        } else if (err.status === 400) {
          // this.toastr.error('Something went wrong', '', {
          //   progressBar: true,
          //   progressAnimation: "decreasing",
          //   timeOut: 3000,
          // })
        } else if (err.status === 404) {
          this.toastr.error(err.error.message, '', {
            progressBar: true,
            progressAnimation: "decreasing",
            timeOut: 3000,
          })
        }
      }));
  }


  getBaseURL(url) {
    if (url.indexOf(apiIdentifier.monolith) !== -1) {
      url = url.replace(apiIdentifier.monolith, environment.baseUrlSS);
    }
    if (url.indexOf(apiIdentifier.smartBuilding) !== -1) {
      url = url.replace(apiIdentifier.smartBuilding, environment.baseUrlSB);
    }
    if (url.indexOf(apiIdentifier.userMS) !== -1) {
      url = url.replace(apiIdentifier.userMS, environment.baseUrlUser);
    }
    return url;
  }


}
