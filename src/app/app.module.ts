import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TidyTreeComponent } from './tidy-tree/tidy-tree.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { DataModule } from './data/data.module';

@NgModule({
  declarations: [
    AppComponent,
    TidyTreeComponent,
    MainPageComponent,
    BarChartComponent,
    ScatterPlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    NgFor,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
    DataModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
