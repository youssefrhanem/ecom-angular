import {FormControl, ValidationErrors} from "@angular/forms";

export class EcomValidators {

  // whitespace validation

  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null{

    // chek if string only contains whitespace

    if ((control.value != null) && (control.value.trim().length === 0)){

      return {'notOnlyWhiteSpace': true};
    } else {
      // valid , return null
      return null;
    }
  }
}
