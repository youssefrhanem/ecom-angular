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
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number =1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

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

    // check if we have a different category than the previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have a different category id than previous
    // than set thePageNumber back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId= ${this.currentCategoryId}, the Page number= ${this.thePageNumber}`);


    //this.productService.getProductList(this.currentCategoryId).subscribe(
      this.productService.getProductListPaginate
      (
        this.thePageNumber -1,
        this.thePageSize,
        this.currentCategoryId
      ).subscribe(
      (data) => {
        console.log("data :  "+ data)
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }





  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe( data => {
      this.products = data;
    });
  }


}
