import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { Tutorial } from 'src/app/components/TutorialClass';
import { configServer } from '../JsonServerClass';
// const baseUrl = 'http://localhost:8080';
// const baseUrl ='https://test-server-359505.uc.r.appspot.com';
// const baseUrl ='https://xmv-server.uc.r.appspot.com';
const AbaseUrl ='https://xmv-it-consulting.uc.r.appspot.com/'
@Injectable({
  providedIn: 'root'
})
export class TutorialService {
   
  constructor(private   http: HttpClient) { }

  getAll(configServer:configServer): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${configServer.baseUrl}/tuto`);
  }
  get(configServer:configServer,id: any): Observable<Tutorial> {
    return this.http.get(`${configServer.baseUrl}/${id}`);
  }
  create(configServer:configServer,data: Tutorial, MongoDB:string): Observable<any> {
    return this.http.post(`${configServer.baseUrl}/tuto?db=${MongoDB}`, data);
  }
  update(configServer:configServer,id: any, data: any): Observable<any> {
    return this.http.put(`${configServer.baseUrl}/${id}`, data);
  }
  delete(configServer:configServer,id: any): Observable<any> {
    return this.http.delete(`${configServer.baseUrl}/${id}`);
  }
  deleteAll(configServer:configServer): Observable<any> {
    return this.http.delete(configServer.baseUrl);
  }
  
  findByTitle(configServer:configServer,title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${configServer.baseUrl}/tuto?title=${title}`);
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}