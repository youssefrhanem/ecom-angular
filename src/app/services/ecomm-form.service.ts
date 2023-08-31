import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {State} from "../common/state";


@Injectable({
  providedIn: 'root'
})
export class EcommFormService {
  private countriesUrl: string = "http://localhost:8080/api/countries";
  private statesUrl: string = "http://localhost:8080/api/states";




  constructor(private http: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchUrlState = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.http.get<GetResponseStates>(searchUrlState).pipe(
      map(response => response._embedded.states)
    )
  }


  /*
  * getCreditMonths(startMonth: number): Observable<number[]> {
  const monthsArray = Array.from({ length: 13 - startMonth }, (_, index) => startMonth + index);
  return of(monthsArray);
}
  * */
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMoth = startMonth; theMoth <= 12; theMoth++) {
      data.push(theMoth);
    }
    return of(data);
  }


  /*
  * getCreditCardYears(): Observable<number[]> {
  const startYear: number = new Date().getFullYear();
  const endYear: number = startYear + 10;

  const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  return of(yearsArray);
}
  * */

    getCreditCardYears(): Observable<number[]> {
      let data: number[] = [];
      const startYear: number = new Date().getFullYear();
      const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }

}

export interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }
}

export interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
