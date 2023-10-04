import { Component, } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  isBarChart: boolean =false;
  isTidyTree: boolean = false;

  constructor() {}

  ngOnInit() {

  }

  public toggleView(view: string) {
    switch(view) {
      case 'barchart': 
        this.isBarChart = true;
        this.isTidyTree = false;
        break;
      case 'tidytree':
          this.isBarChart = false;
          this.isTidyTree = true;
          break;
      default:
          this.isBarChart = true;
          this.isTidyTree = true;
    }
  }


}
