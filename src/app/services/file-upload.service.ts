/****
 – FormData is a data structure that can be used to store key-value pairs. We use it to build an object 
 which corresponds to an HTML form with append() method.
– We set reportProgress: true to exposes progress events. Notice that this progress event are expensive 
(change detection for each event), so you should only use when you want to monitor it.
– We call the request(PostRequest) & get() method of HttpClient to send an HTTP POST & Get request to the 
Spring Boot File Upload server.
****/

import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  upload(bucket:string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const http_post=this.baseUrl+'/upload?bucket='+bucket;
    const req = new HttpRequest('POST', http_post, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
  getFilesBucket(bucket:string): Observable<any> {
    //return this.http.get<any>(`${this.baseUrl}?bucket=${bucket}`);
    const http_get=this.baseUrl+'/files?bucket='+bucket;
    return this.http.get<any>(http_get);
                            
  }
  getListBuckets(): Observable<any> {
    return this.http.get<any>(this.baseUrl+'/lBucket');
                            
  }
  getContentObject(bucket:string, object:string): Observable<any> {
    const http_get=this.baseUrl+'/files/'+object+'?bucket='+bucket;
    return this.http.get<any>(http_get);
                            
  }
  getMetaObject(bucket:string, object:string): Observable<any> {
    const http_get=this.baseUrl+'/meta/'+object+'?bucket='+bucket;
    return this.http.get<any>(http_get);
                            
  }
}