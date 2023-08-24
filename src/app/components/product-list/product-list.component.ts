import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

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

  previousKeyword: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
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
      ).subscribe(this.processResult());
  }


  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }


/*   handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe( data => {
      this.products = data;
    });
  }*/




  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    this.productService.searchProductsPagination(
      this.thePageNumber -1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
  }

  private processResult(){
    return (data: any) => {
      const { _embedded, page } = data;
      this.products = _embedded.products;
      this.thePageNumber = page.number + 1;
      this.thePageSize = page.size;
      this.theTotalElements = page.totalElements;
    };
  }


  addToCart(theProduct: Product) {
    console.log(`Adding To Cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
