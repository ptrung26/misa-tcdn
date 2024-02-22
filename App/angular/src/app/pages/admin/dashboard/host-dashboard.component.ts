import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/animated';

@Component({
    templateUrl: './host-dashboard.component.html',
    styleUrls: ['./host-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HostDashboardComponent extends AppComponentBase implements OnInit {
    vlTest: any;
    constructor(injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);

        // Create chart instance
        var chart = am4core.create('chart-screen', am4charts.XYChart);

        // Add data
        chart.data = [
            {
                country: 'Lithuania',
                litres: 501.9,
                units: 250,
            },
            {
                country: 'Czech Republic',
                litres: 301.9,
                units: 222,
            },
            {
                country: 'Ireland',
                litres: 201.1,
                units: 170,
            },
            {
                country: 'Germany',
                litres: 165.8,
                units: 122,
            },
            {
                country: 'Australia',
                litres: 139.9,
                units: 99,
            },
            {
                country: 'Austria',
                litres: 128.3,
                units: 85,
            },
            {
                country: 'UK',
                litres: 99,
                units: 93,
            },
            {
                country: 'Belgium',
                litres: 60,
                units: 50,
            },
            {
                country: 'The Netherlands',
                litres: 50,
                units: 42,
            },
        ];

        // Sửa lại trục X và Y

        // Trục Y
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'country';
        categoryAxis.title.text = 'Countries';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.inversed = true;
        // Trục X
        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.ticks.template.disabled = false;
        valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
        // Sửa lại các series
        var litreSeries = chart.series.push(new am4charts.ColumnSeries());
        litreSeries.dataFields.valueX = 'litres';
        litreSeries.dataFields.categoryY = 'country';
        litreSeries.name = 'Sales';
        litreSeries.calculatePercent = true;

        var unitSeries = chart.series.push(new am4charts.ColumnSeries());
        unitSeries.dataFields.valueX = 'units';
        unitSeries.dataFields.categoryY = 'country';
        unitSeries.name = 'Units';
        unitSeries.tooltipText = '{name}: [bold]{valueX}[/]';
        unitSeries.calculatePercent = true;

        chart.cursor = new am4charts.XYCursor();
    }
}
