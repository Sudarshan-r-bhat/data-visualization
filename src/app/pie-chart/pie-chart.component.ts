import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentConstants } from '../data/component-constants';
import { PiechartData } from '../data/piechart-data';
import * as d3 from 'd3';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  providers: [ComponentConstants, PiechartData]
})
export class PieChartComponent {
  @ViewChild("pieChart", {static: true}) pieChart!: ElementRef;
  private data: any;
  constructor(
    private pieChartData: PiechartData,
    private constants: ComponentConstants){}

  ngOnInit() {
    this.data = this.pieChartData.get();
    this.renderPieChart(this.data);
  }

  private renderPieChart(data: []): void {
    
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight(2);
    const viewBoxX = this.constants.getViewBoxWidth(1.2);

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.05 };

    // --- calculations ---.
    // d3 layout calc
    const handleZoom = (event: any) => {
      d3.selectAll('svg g')
        .attr('transform', event.transform);
    }
    let zoom = d3.zoom()
      .on('zoom', handleZoom);

    const pieSvg = d3.select(this.pieChart.nativeElement)
                        .attr('height', viewBoxY* 1/3)
                        .attr('width', viewBoxX / 2)
                        .style('background-color', 'white');
    pieSvg.call(zoom);

    const g = pieSvg.append('g')
      .attr('transform', `translate(${viewBoxX/4},${viewBoxY/6})`);

    // pie chart calc
    const pieInnerRadius = Math.min(viewBoxX, viewBoxY) / 10;
    const pieOuterRadius = Math.min(viewBoxX, viewBoxY) / 7;
    const arc: any = d3.arc()
      .innerRadius(Math.min(viewBoxX, viewBoxY) / 10)
      .outerRadius(Math.min(viewBoxX, viewBoxY) / 7)
      ;
    const pie = d3.pie().sortValues(null)
      .padAngle(2*Math.PI/180) // 2deg
      .value((d: any) => d.population);

    const color: any = d3.scaleOrdinal()
      .domain(data.map((d: {country: string, population:number}) => d.country))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.3), data.length).reverse());
      ;
    
    pie(data).forEach((d:any) => { console.log(arc.centroid(d)[0]); console.log(color(d.data.country));});
    
    // draw the paths.
    g.selectAll('path').data(pie(data)).enter()
    .append('path')
      .attr('fill', (d: any) => color(d.data.country) )
      .attr('d', arc)
      ;
    g.selectAll('text').data(pie(data)).enter()
      .append('text')
        .attr('x', d => arc.centroid(d)[0])
        .attr('y', d => arc.centroid(d)[1])
      .text( (d: any) => d.data.country + ": " + d.data.population)
      .attr('font-size', `${5 * viewBoxY/viewBoxX}`);

    const ordinalScale: any = d3.scaleOrdinal()
            .domain(data.map((d: {country: string, population:number}) => d.country))
            .range(d3.quantize(t => (t *  200*viewBoxY/viewBoxX + 200*viewBoxY/viewBoxX), data.length));
            ;
    // draw Lengends
    g.selectAll('rect').data(data).enter()
      .append('rect')
        .attr('x', (d: any) => -viewBoxX / 4 + 5*viewBoxX/viewBoxY)
        .attr('y', (d: any) => -viewBoxY / 4 + ordinalScale(d.country))
        .attr('height', `${5 * viewBoxY/viewBoxX}`)
        .attr('width', `${10 * viewBoxY/viewBoxX}`)
        .attr('fill', (d: any) => color(d.country))
        ;
    const g2 = pieSvg.append('g')
    .attr('transform', `translate(${viewBoxX/4},${viewBoxY/6})`);
    g2.selectAll('text').data(data).enter()
      .append('text')
      .attr('x', (d: any) => -viewBoxX / 4 + 25*viewBoxX/viewBoxY)
      .attr('y', (d: any) => -viewBoxY / 4 + 5 *viewBoxY/viewBoxX + ordinalScale(d.country))
      .text( (d: any) => d.country + "= " + d.population)
        .attr('fill', 'black')
        .attr('font-size', `${10 * viewBoxY/viewBoxX}`)
      ;
  }


}
