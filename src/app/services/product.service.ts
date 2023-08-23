import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

const BASE_URL = 'http://localhost:8080/api/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductList(categoryId: number): Observable<Product[]> {
    // http://localhost:8080/api/products/search/findByCategoryId?id=1
    const searchUrl = `${BASE_URL}/search/findByCategoryId?id=${categoryId}`;
    return this.http
      .get<GetResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  // Product Category
  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl = `http://localhost:8080/api/product-category`;
    return this.http
      .get<GetResponseProductCategory>(categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${BASE_URL}/search/findByNameContaining?name=${theKeyword}`;

    return this.http.get<GetResponse>(searchUrl)
      .pipe(map(response => response._embedded.products));
  }


}


interface GetResponse {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
