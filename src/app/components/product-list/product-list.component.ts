import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    //this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    this.searchMode ? this.handleSearchProducts(): this.handleListProducts();

  }

  handleListProducts() {
    // check if id param is available
    const hasCategoryId = this.route.snapshot.paramMap.has('id');
    this.currentCategoryId = hasCategoryId
      ? +this.route.snapshot.paramMap.get('id')!
      : 1;
    /* if (hasCategoryId) {
      // get id param string and convert it to a number using th "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // not cat is available default id is 1
      this.currentCategoryId = 1;
    }*/
    this.productService.getProductList(this.currentCategoryId).subscribe(
      (data) => {
        this.products = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe( data => {
      this.products = data;
    });
  }


}
