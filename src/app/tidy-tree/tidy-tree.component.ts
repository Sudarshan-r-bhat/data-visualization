import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { data } from './data';
import { ComponentConstants } from '../data/component-constants';
import { TidyTreeData } from '../data/tidy-tree-data';

@Component({
  selector: 'app-tidy-tree',
  templateUrl: './tidy-tree.component.html',
  styleUrls: ['./tidy-tree.component.css'],
  providers: [ComponentConstants, TidyTreeData]
})
export class TidyTreeComponent {

  constructor(private constants: ComponentConstants, private tidyTreeData: TidyTreeData) { }

  @ViewChild("treeChart", { static: true }) treeChart!: ElementRef
  data: any = data;


  ngOnInit() {
    this.renderTree(this.tidyTreeData.get());
  }

  // render functiont to generate a Tree structure for a given data
  private renderTree(data: any): void {

    const hierarchy = d3.hierarchy(data);
    console.log('depth', hierarchy.depth);
    
    const windowScreenY = this.constants.screenHieght;
    const windowScreenX = this.constants.screenWidth;

    const viewBoxY = this.constants.getViewBoxHeight(hierarchy.height / 2.5);
    const viewBoxX = this.constants.getViewBoxWidth(hierarchy.height / 2.5);

    const margin = { "top": viewBoxY * 0.1, "right": 10, "bottom": 10, "left": viewBoxX * 0.05 };
    const tree = d3.tree().size([viewBoxX, viewBoxY * 0.8]);
    const rootNode = tree(hierarchy);
    const links = tree(hierarchy).links();
    const descendants = rootNode.descendants();
    var linkPathGenerator = d3.linkHorizontal();
    console.log('depth', hierarchy);

    const treeSvg = d3.select(this.treeChart.nativeElement);
    treeSvg.attr("width", viewBoxX)
      .attr("height", viewBoxY)
      .style("background-color", "steelblue")
      .style("overflow", "scroll")
      ;

    treeSvg.selectAll("path").data(links)
      .enter().append("path")
      // .join("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("d", d => {
        var source: [number, number] = [d.source.y + margin.left, d.source.x];
        var target: [number, number] = [d.target.y + margin.left, d.target.x];
        var path = linkPathGenerator({source, target})
        console.log(path);
        return path;
      })
      // .attr("d", d => `
      //     M${d.target.y},${d.target.x}
      //     C${d.source.y},${d.target.x}
      //      ${d.source.y},${d.source.x}
      //      ${d.source.y},${d.source.x}
      //      ${d.source.y},${d.target.x}
      //   `);
    
    const scaleX = (d: any) => d.y + margin.left;
    treeSvg.selectAll('circle').data(descendants).enter().append("circle")
      .attr("cx", scaleX)
      .attr("cy", d => d.x)
      .attr("r", 10)
      ;
    treeSvg.selectAll("text").data(descendants).enter().append("text")
      .attr("x", scaleX)
      .attr("y", d => d.x)
      .text(d => { return (Object(d.data)) == undefined ? "n/a" : (Object(d.data)).name; })
      .attr("fill", "white");

  }
}
