import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers, RequestMethod, RequestOptionsArgs } from '@angular/http';


import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { HttpClient, HttpClientModule,HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';  // change to new RxJS 6 import syntax
import { Produit } from '../modele/produit';


@Injectable()
export class HttpService {

    headers: any;
    options: RequestOptions;

    produit:Produit;

    constructor(private _http: Http, private http: HttpClient) {
        this.headers = new Headers({
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
        });
        this.options = new RequestOptions({ headers: this.headers })
    }


    get(url: string,param:any): Observable<any[]> {
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        let options :any= {
            params: param
          };
        return forkJoin(
            this.http.get(url,param),
        );
    }



    postdd(url: string, body: any, options?: any): Observable<any[]> {
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin(
            this.http.post(url, body, options),
        );
    }


    post(url: string, param: any, opt?: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                let val = opt[key];
                params.set(key, val);
            }
        }
        this.options = new RequestOptions({ params: params });
        return this._http
            .post(url, param, this.options);
    }


    delete(url: string, param: any): Observable<any> {
        let options :any= {
            params: param
          };
        return this._http
            .delete(url,options);
    }

    getHttpObservableArray(observableObjects: { url: string, parametres: any }[]): Observable<any[]> {
        let observableArray: Observable<any>[] = [];
        for (let observableObject of observableObjects) {
            observableObject.parametres = {
                test : "vamm"
            }
              observableArray.push(this.get(observableObject.url, observableObject.parametres));
        }
        return forkJoin(observableArray);
    }

    postHttpObservableArray(observableObjects: { url: string, body: any, parametres: any }[]): Observable<any>[] {
        let observableArray: Observable<any>[] = [];
        for (let observableObject of observableObjects) {
            observableArray.push(this.post(observableObject.url, observableObject.body, observableObject.parametres));
        }
        return observableArray;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}