import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('=== API SERVICE INITIALIZED ===');
    console.log('Base URL:', this.baseUrl);
    console.log('Environment:', environment);
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    const url = `${this.baseUrl}/${endpoint}`;
    console.log('API GET:', url);
    return this.http.get<T>(url, { params: httpParams });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    console.log('API POST:', url);
    return this.http.post<T>(url, body);
  }

  put<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body || {});
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
