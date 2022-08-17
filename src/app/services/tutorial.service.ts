import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { Tutorial } from 'src/app/components/TutorialClass';

// const baseUrl = 'http://localhost:8080';
// const baseUrl ='https://test-server-359505.uc.r.appspot.com';
// const baseUrl ='https://xmv-server.uc.r.appspot.com';
const baseUrl ='https://xmv-it-consulting.uc.r.appspot.com/'
@Injectable({
  providedIn: 'root'
})
export class TutorialService {
   
  constructor(private   http: HttpClient) { }

  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}/tuto`);
  }
  get(id: any): Observable<Tutorial> {
    return this.http.get(`${baseUrl}/${id}`);
  }
  create(data: Tutorial, MongoDB:string): Observable<any> {
    return this.http.post(`${baseUrl}/tuto?db=${MongoDB}`, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
  
  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}/tuto?title=${title}`);
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