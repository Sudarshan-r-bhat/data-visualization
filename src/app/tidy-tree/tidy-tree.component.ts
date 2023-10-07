import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { data } from './data';
import { ComponentConstants } from '../data/component-constants';

@Component({
  selector: 'app-tidy-tree',
  templateUrl: './tidy-tree.component.html',
  styleUrls: ['./tidy-tree.component.css'],
  providers: [ComponentConstants]
})
export class TidyTreeComponent {

  constructor(private constants: ComponentConstants) { }

  @ViewChild("treeChart", { static: true }) treeChart!: ElementRef
  data: any = data;


  ngOnInit() {
    this.renderTree(this.data);
  }

  // render functiont to generate a Tree structure for a given data
  private renderTree(data: any): void {
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight();
    const viewBoxX = this.constants.getViewBoxWidth();

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.1 };

    const treeSvg = d3.select(this.treeChart.nativeElement);
    treeSvg.attr("width", 900)
      .attr("height", 900)
      .style("background-color", "steelblue");

    const tree = d3.tree().size([viewBoxX, viewBoxY]);
    const hierarchy = d3.hierarchy(data);
    const rootNode = tree(hierarchy);
    const links = rootNode.links();
    const descendants = rootNode.descendants();
    var linkPathGenerator = d3.linkHorizontal()
      .x((d: any) => +(d.y))
      .y((d: any) => +(d.x));
    console.log(linkPathGenerator);
    treeSvg.selectAll("path").data(links)
      .enter().append("path")
      // .join("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("d", d => {
        var source: [number, number] = [d.source.x, d.source.y];
        var target: [number, number] = [d.target.x, d.target.y];
        var path = linkPathGenerator({source, target})
        return path;
      })
      // .attr("d", d => `
      //     M${d.target.y},${d.target.x}
      //     C${d.source.y},${d.target.x}
      //      ${d.source.y},${d.source.x}
      //      ${d.source.y},${d.source.x}
      //      ${d.source.y},${d.target.x}
      //   `);

    treeSvg.selectAll('circle').data(descendants).enter().append("circle")
      .attr("cx", d => d.y)
      .attr("cy", d => d.x)
      .attr("r", 20);
    treeSvg.selectAll("text").data(descendants).enter().append("text")
      .attr("x", d => d.y)
      .attr("y", d => d.x)
      .text(d => { console.log(d.data); return (Object(d.data)) == undefined ? "n/a" : (Object(d.data)).name; })
      .attr("fill", "white");

  }
}
