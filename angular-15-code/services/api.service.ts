// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'https://api.example.com'; 

  constructor(private http: HttpClient) {}

  public getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }

  public getQueryData(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`, { params: { q: query } });
  }

  public postData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/data`, data);
  }

}
