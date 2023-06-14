import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentDev as environment } from '@env/environment.dev';
import { IOrder } from '@models/index';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersUrl = `${environment.apiUrl}/items/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: IOrder): Observable<any> {
    return this.http.post(this.ordersUrl, order);
  }
}
