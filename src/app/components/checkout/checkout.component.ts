import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EcommFormService} from "../../services/ecomm-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCartYears: number[] = [];
  creditCartMonths: number[] = [];


  /*
      checkoutFormGroup = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
      });
  */

  constructor(private formBuilder: FormBuilder,
              private ecommFormService: EcommFormService) {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        country: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

  }

  ngOnInit(): void {

    const startMonth: number = new Date().getMonth() + 1;
    console.log("start Month:" + startMonth);

    this.ecommFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved Credit Cart Months:" + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    );

    this.ecommFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved Credit Cart Years:" + JSON.stringify(data));
        this.creditCartYears = data;
      }
    );

    this.ecommFormService.getCountries().subscribe(
      data => {
        console.log("Retrived Countries" + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email address : " + this.checkoutFormGroup.get('customer')?.value.email);
  }


  // copyShippingAddressToBillingAddress(event: any) {
  //   if (event.target.checked) {
  //    this.checkoutFormGroup.controls.billingAddress
  //      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
  //   }
  // }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      const shippingAddress = this.checkoutFormGroup.get('shippingAddress');
      if (shippingAddress) {
        this.checkoutFormGroup.get('billingAddress')?.setValue(shippingAddress.value);
      }
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
    }
  }

  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current years equals the current year then start with the current month

    let startMonth: number;

    currentYear === selectedYear ? startMonth = new Date().getMonth()+1 : startMonth = 1;

    this.ecommFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months:" + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    )


  }


  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    console.log(countryCode);

    this.ecommFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates =data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        // @ts-ignore
        formGroup?.get('state').setValue(data[0]);
      }
    )

  }
}



