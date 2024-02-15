import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription, merge, forkJoin, of, timer, Subject } from 'rxjs';
import { debounceTime, delay, switchMap } from '@node_modules/rxjs/internal/operators';
// import {Color} from '@node_modules/ng2-charts/lib/color';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as mauDinhDuong from '@app/shared/constMaMauDinhDuong';
import { DinhDuongWithNangLuong } from '@app/pages/xay-dung-thuc-don/MonAnExt';

am4core.useTheme(am4themes_animated);

@Component({
    templateUrl: './bieu-do-dinh-duong.component.html',
    selector: 'bieu-do-dinh-duong',
})

export class BieuDoDinhDuongComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() nangLuong$: Subject<number>;
    @Input() ttDam$: Subject<DinhDuongWithNangLuong>;
    @Input() ttChatBeo$: Subject<DinhDuongWithNangLuong>;
    @Input() ttBotDuong$: Subject<DinhDuongWithNangLuong>;
    @Input() ttAlco$: Subject<DinhDuongWithNangLuong>;
    @Input() showLegend = true;
    @Input() fontSizeNangLuongNumber = 25; //px
    @Input() fontSizeNangLuongText = 18; //px (Kcal)
    @Input() innerRadius = 50;
    @Input() height: string;

    // @Input() ttChatSo$: BehaviorSubject<DinhDuongWithNangLuong>;
    @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;
    unsubscribe: Subscription[] = [];

    constructor() {
    }

    ngAfterViewInit(): void {
        // switchMap(() => {
        //     return combineLatest([this.nangLuong$, this.ttDam$, this.ttChatBeo$, this.ttBotDuong$, this.ttAlco$]);
        // });
        const unsub = combineLatest([this.nangLuong$, this.ttDam$, this.ttChatBeo$, this.ttBotDuong$, this.ttAlco$])
            .pipe(debounceTime(300))
            .subscribe(([nangLuong, dam, cbeo, botDuong, alco]) => {
                console.log('Ve Bieu Do');
                this.initChart(nangLuong, dam, cbeo, botDuong, alco);
            });

        this.unsubscribe.push(unsub);
    }


    ngOnInit() {

    }

    initChart(nangLuong: number, cDam: DinhDuongWithNangLuong, cBeo: DinhDuongWithNangLuong, botDuong: DinhDuongWithNangLuong,
              alco: DinhDuongWithNangLuong) {
        let chart = am4core.create(this.chartElement.nativeElement, am4charts.PieChart);
        chart.responsive.enabled = true;
        const data: { nangLuong: number; strNangLuong: string, tyLe: string; tenDinhDuongVi: string, hamLuong: string, color: any }[] = [];
        data.push({
            tenDinhDuongVi: cDam.tenDinhDuongVi ? cDam.tenDinhDuongVi : 'Chất đạm',
            nangLuong: cDam.nangLuong,
            strNangLuong: cDam.nangLuong.toFixed(0),
            tyLe: cDam.tyLe.toFixed(cDam.slPhanThapPhan) + '%',
            hamLuong: cDam.hamLuong_SauTT.toFixed(cDam.slPhanThapPhan),
            color: am4core.color(mauDinhDuong.mauDamTo),
        });
        data.push({
            tenDinhDuongVi: botDuong.tenDinhDuongVi ? botDuong.tenDinhDuongVi : 'Chất bột đường',
            nangLuong: botDuong.nangLuong,
            strNangLuong: botDuong.nangLuong.toFixed(0),
            tyLe: botDuong.tyLe.toFixed(botDuong.slPhanThapPhan) + '%',
            hamLuong: botDuong.hamLuong_SauTT.toFixed(botDuong.slPhanThapPhan),
            color: am4core.color(mauDinhDuong.mauBotDuongTo),
        });
        // }
        // if (cBeo.tyLe) {
        data.push({
            tenDinhDuongVi: cBeo.tenDinhDuongVi ? cBeo.tenDinhDuongVi : 'Chất béo',
            nangLuong: cBeo.nangLuong,
            strNangLuong: cBeo.nangLuong.toFixed(0),
            tyLe: cBeo.tyLe.toFixed(cBeo.slPhanThapPhan) + '%',
            hamLuong: cBeo.hamLuong_SauTT.toFixed(cBeo.slPhanThapPhan),
            color: am4core.color(mauDinhDuong.mauChatBeoTo),
        });
        // }
        if (alco.tyLe) {
            data.push({
                tenDinhDuongVi: alco.tenDinhDuongVi,
                nangLuong: alco.nangLuong,
                strNangLuong: alco.nangLuong.toFixed(0),
                tyLe: alco.tyLe.toFixed(alco.slPhanThapPhan) + '%',
                hamLuong: alco.hamLuong_SauTT.toFixed(alco.slPhanThapPhan),
                color: am4core.color(mauDinhDuong.mauConTo),
            });
        }
        // if (cDam.tyLe === 0 && botDuong.tyLe === 0 && cBeo.tyLe === 0 && alco.tyLe === 0) {
        //     data = [{ tenDinhDuongVi: "Chất bột đường",nangLuong:"0",}]
        //     data.push({
        //         tenDinhDuongVi: 'Không chứa chất sinh năng lượng',
        //         nangLuong: 100,
        //         strNangLuong: '',
        //         tyLe: '100 %',
        //         hamLuong: '',
        //         color: am4core.color('rgb(191,191,205)'),
        //     });
        // }
        chart.data = data;
        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'nangLuong';
        pieSeries.dataFields.category = 'tenDinhDuongVi';
        if (cDam.tyLe === 0 && botDuong.tyLe === 0 && cBeo.tyLe === 0 && alco.tyLe === 0) {
            pieSeries.slices.template.tooltipText = '';
        } else {
            pieSeries.slices.template.tooltipText = '[bold]{category}[/]\n[font-size:14px]{strNangLuong} kcal | {tyLe} | {hamLuong} g';
        }


        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template.propertyFields.fill = 'color';
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

        // // Let's cut a hole in our Pie chart the size of 30% the radius
        // chart.innerRadius = am4core.percent(30);

        // Add label
        chart.innerRadius = this.innerRadius;
        const label = chart.seriesContainer.createChild(am4core.Label);
        label.textAlign = 'middle';
        label.horizontalCenter = 'middle';
        label.verticalCenter = 'middle';
        label.fontWeight = 'bold';
        const sizeNl = this.fontSizeNangLuongNumber;
        const sizeTextNl = this.fontSizeNangLuongText;
        label.adapter.add('text', function(text, target) {
            return `[bold font-size: ${sizeNl}px #2C353C] ${nangLuong.toFixed(0)} [/]\n[font-size:${sizeTextNl}px #9BAEBC font-style: italic]Kcal[/]`;
        });


        if (this.showLegend) {
            chart.legend = new am4charts.Legend();
            // chart.legend.labels.template.text = `[bold {color}]{name} {values.value.percent.formatNumber('#.0')}[/]`;

            // tslint:disable-next-line:no-unused-expression
            chart.legend.valueLabels.template.text = `[bold] {value.percent.formatNumber('#.0')}% [/]`;
            console.log('chart.legend', chart.legend);
            chart.legend.useDefaultMarker = true;
            const marker = chart.legend.markers.template;
            marker.width = 25;
            marker.height = 10;
            let marker2 = chart.legend.markers.template.children.getIndex(0);
            // @ts-ignore
            marker2.cornerRadius(12, 12, 12, 12);

            chart.legend.itemContainers.template.togglable = false;
            chart.legend.itemContainers.template.events.on('hit', function(ev) {
                // @ts-ignore
                const slice = ev.target.dataItem.dataContext.slice;
                slice.isActive = !slice.isActive;
            });

        }

    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach(item => item.unsubscribe());
    }

}
