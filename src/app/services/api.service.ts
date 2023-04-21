import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ApiResponse } from "../interfaces/response";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient, private router: Router) { }

    public get(slug: string) {
        return this.http.get<any>(slug);
    }

    public getWithParam(slug: string, param: any) {
        return this.http.get<any>(slug, param);
    }

    public post(slug: string, postData: any) {
        return this.http.post<any>(slug, postData);
    }

    public delete(slug: string) {
        return this.http.delete<any>(slug);
    }

    public patch(slug: string, postData: any) {
        return this.http.patch<any>(slug, postData);
    }

    public getExportXlsPdf(params: any): Observable<Blob> {
        const url = params;
        const myHeaders = new HttpHeaders();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        return this.http.get(url, { responseType: 'blob', headers: myHeaders });
    }

    // public download(slug: string, type: string, title: string): Observable<any> {
    //     const myHeaders = new HttpHeaders();
    //     myHeaders.append('Access-Control-Allow-Origin', '*');
    //     this.http.get(slug, { responseType: 'blob', headers: myHeaders }).subscribe((resp: any) => {
    //         if (type === 'pdf') {
    //             this.downloadPdf(resp, title);
    //         } else {
    //             this.downloadCSV(resp, title);
    //         }
    //         return true;
    //     }, (err: any) => {
    //         let loading = false;
    //         return {loading, err};
    //     });
    // }

    private downloadPdf(resp: any, title: string) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob)

        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = title;
        fileLink.click();
    }

    private downloadCSV(resp: any, title: string) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob)

        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = title;
        fileLink.click();
    }
}