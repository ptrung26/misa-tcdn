import { Component, Injector, OnInit } from '@angular/core';
import { LayoutTabManagerService } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.service';
import { TabDataType } from '@app/shared/layout-tab/layout-tab-manager/TabDataType';
import { OraMapModComService } from '@app/shared/layout-tab/ora-map-mod-com.service';
import { MapConfig } from '@app/pages/admin/danh-muc/map.config';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    template: `
        <div [@routerTransition]>
            <layout-tab-manager></layout-tab-manager>
        </div>
    `,
    styles: [
            `
            :host ::ng-deep ora-page-header .root {
                padding-top: 0;
            }
        `,
    ],
    animations: [appModuleAnimation()],
})

export class IndexComponent implements OnInit {
    constructor(private layoutService: LayoutTabManagerService,
                private mapSerive: OraMapModComService,
    ) {
    }

    ngOnInit(): void {
        this.mapSerive.initMap(new MapConfig().configs);
        this.initTab();
    }

    initTab() {
        this.layoutService.addTab(new TabDataType({
            title: 'Danh mục',
            iconClass: 'fas fa-home',
            key: 'dash-board2',
            viewType: 'component',
        }));
    }

}
