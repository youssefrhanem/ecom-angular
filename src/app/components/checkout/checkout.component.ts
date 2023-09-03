import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EcommFormService} from "../../services/ecomm-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {EcomValidators} from "../../validators/ecom-validators";


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
        firstName: new FormControl('',
          [Validators.required,
                        Validators.minLength(2),
                        EcomValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',
          [Validators.required,
                        Validators.minLength(2),
                        EcomValidators.notOnlyWhiteSpace]),
        email: ['',
                 [Validators.required,
                  Validators.email,
                  Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            EcomValidators.notOnlyWhiteSpace]),

        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            EcomValidators.notOnlyWhiteSpace]),

        country: new FormControl('', [Validators.required]),

        state: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(5),
            EcomValidators.notOnlyWhiteSpace])
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

  // Customer form
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  // Shipping form
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email address : " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("the shipping address country  : " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("the shipping state  : " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    // diplay all the eroor
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("checkoutFormGroup is valid: " + this.checkoutFormGroup.valid)

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

        // TODO Bug fix code copy option select
        this.billingAddressStates = this.shippingAddressStates;
      }
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();

      // TODO rest Bug Fix State
      this.billingAddressStates = [];
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
    const countryName = formGroup?.value.country.name;
    console.log(countryCode);
    console.log(countryName)

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



