import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }


  addToCart(theCartItem: CartItem){
    // check if we already have item in our cart
    let alreadyExistsInCart: boolean = false ;
    let existsCartItem: CartItem | undefined = undefined;

/*
    if (this.cartItem.length > 0 ) {
      //  find the item in the cart based on item id
      for (let tempCartItem of this.cartItem){
        if (tempCartItem.id === theCartItem.id){
          existsCartItem = tempCartItem;
          break;
        }
      }
      //check if we found it
      alreadyExistsInCart = (existsCartItem != undefined);

      }
*/
    if (this.cartItem.length > 0 ) {
      // Vérifier si l'élément existe déjà dans le panier

      existsCartItem =
        this.cartItem.find(
          tempCartItem =>
            tempCartItem.id === theCartItem.id);

      // Si existsCartItem n'est pas undefined, cela signifie que l'élément existe déjà
      alreadyExistsInCart = (existsCartItem !== undefined);
    }
      if (alreadyExistsInCart){
        // @ts-ignore
        existsCartItem.quantity++;
      } else {
        this.cartItem.push(theCartItem);
      }

      // compute cart total price and total quantity
    this.computeCartTotals();

}


  private computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItem){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // publish the new values all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart Data
    this.logCartData(totalPriceValue,totalQuantityValue);

  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Content of the Cart");
    for (let tempCartItem of this.cartItem){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, Quantity= ${tempCartItem.quantity},
      unitPeice= ${ tempCartItem.unitPrice}, subTotalPrice= ${subTotalPrice}`);
    }
    console.log(`Total Price: ${totalPriceValue.toFixed(2)}, Total Quantity= ${totalQuantityValue},`);
    console.log("-----");
  }
}
