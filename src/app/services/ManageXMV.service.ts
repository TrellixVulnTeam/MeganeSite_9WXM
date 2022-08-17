
import { Inject,Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpRequest, HttpEvent,  HttpErrorResponse, HttpHeaders, HttpContext } from '@angular/common/http';
import { BioData } from '../JsonServerClass';
import { ThisReceiver } from '@angular/compiler';
// const baseUrl = 'http://localhost:8080/api/tutorials';
// const baseUrl = 'http://localhost:8080';
// const baseUrl ='https://test-server-359505.uc.r.appspot.com';
// const baseUrl ='https://xmv-server.uc.r.appspot.com';

@Injectable({
  providedIn: 'root',
})
export class ManageXMVService {
    //baseUrl:string ='https://xmv-it-consulting.uc.r.appspot.com';

    constructor(
        private   http: HttpClient,
       
        @Inject('baseUrl') private baseUrl:string
        ) {this.baseUrl=baseUrl}

    myHeader=new HttpHeaders({'content-type': 'application/json',
    'cache-control': 'private, max-age=0'
  });;

    getListBuckets(): Observable<any> {
        return this.http.get<any>(this.baseUrl+'/lBucket');                       
    }

    getListObjects(bucket:string): Observable<any> {
        //return this.http.get<any>(`${this.baseUrl}?bucket=${bucket}`);
        const http_get=this.baseUrl+'/files?bucket='+bucket;
        return this.http.get<any>(http_get);
                                
    }

    getContentObject(bucket:string, object:string): Observable<any> {
        const http_get=this.baseUrl+'/files/'+object+'?bucket='+bucket;
        return this.http.get<any>(http_get);
                                
    }
    getMetaObject(bucket:string, object:string): Observable<any> {
        const http_get=this.baseUrl+'/meta/'+object+'?bucket='+bucket;
        return this.http.get<any>(http_get);
                                
    }


    uploadObjectInitial(bucket:string, file: File): Observable<HttpEvent<any>> {
        var formData: FormData = new FormData();
        formData.append('file', file);
        const http_post=this.baseUrl+'/upload?bucket='+bucket;
        const req = new HttpRequest('POST', http_post, formData,  {
        // headers: this.myHeader,
        reportProgress: true,
        responseType: 'json'
        });
        return this.http.request(req);
    }


     updateMetadata(bucket:string, objectN:string): Observable<HttpEvent<any>> {

            const http_post=this.baseUrl+'/updateMeta/'+objectN+'?bucket='+bucket;
            const req = new HttpRequest('POST', http_post, objectN);
            return this.http.request(req);
        }
    


    updateObject(bucket:string, object:string, file:File): Observable<HttpEvent<any>> {
        const http_post=this.baseUrl+'/save/'+object+'?bucket='+bucket;

            
        var req = new HttpRequest('POST',  http_post, file);
        
        return this.http.request(req);
    }
}
