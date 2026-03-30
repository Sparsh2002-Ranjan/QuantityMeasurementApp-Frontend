import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConversionService {
  private base = 'http://localhost:8080/api/v1/quantities';

  constructor(private http: HttpClient) {}

  convert(payload: {
    type: string;
    thisQuantityDTO: { value: number; unit: string };
    thatQuantityDTO: { value: number; unit: string };
  }): Observable<any> {
    return this.http.post(`${this.base}/convert`, payload);
  }

  arithmetic(payload: {
    type: string;
    operation: string;
    value1: number;
    unit1: string;
    value2: number;
    unit2: string;
    resultUnit: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/arithmetic`, payload);
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/history`);
  }
}
