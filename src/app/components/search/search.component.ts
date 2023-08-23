import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  constructor(private router: Router) {
  }

  doSearch(value: string) {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }

  ngOnInit(): void {
  }

}
