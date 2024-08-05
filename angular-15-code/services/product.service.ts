// product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = 'http://api.example.com/products';

  constructor(private http: HttpClient) {}

  public calculateDiscount(price: number, discount: number): number {
    return price - (price * discount / 100);
  }

  
}
