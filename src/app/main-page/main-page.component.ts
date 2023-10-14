import { Component, } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  isBarChart: boolean =false;
  isTidyTree: boolean = true;
  isScatterPlot: boolean = false;
  isLineGraph: boolean = false;
  isRadialTree: boolean = false;
  isPieChart: boolean = false;
  isEdgeBundling: boolean = false;

  constructor() {}

  ngOnInit() {

  }

  public toggleView(viewNumber: number) {
    this.isBarChart = (1 === viewNumber);
    this.isTidyTree = (2 === viewNumber);
    this.isScatterPlot = (3 === viewNumber);
    this.isLineGraph = (4 === viewNumber);
    this.isRadialTree = (5 === viewNumber);
    this.isPieChart = (6 == viewNumber);
    this.isEdgeBundling = (7 == viewNumber);
  }


}
