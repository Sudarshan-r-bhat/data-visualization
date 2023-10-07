import { Component, } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  isBarChart: boolean =false;
  isTidyTree: boolean = false;
  isScatterPlot: boolean = true;

  constructor() {}

  ngOnInit() {

  }

  public toggleView(viewNumber: number) {
    this.isBarChart = (1 === viewNumber);
    this.isTidyTree = (2 === viewNumber);
    this.isScatterPlot = (3 === viewNumber);
  }


}
