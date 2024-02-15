import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IOraSwitch } from '@app/shared/customize-comp/ora-list-switch/ora-list-switch.component';

@Component({
    templateUrl: './host-dashboard.component.html',
    styleUrls: ['./host-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HostDashboardComponent extends AppComponentBase {

    vlTest: any;
    dataSource: IOraSwitch[] = [{
        id: 1,
        title: 'Cơm chay',
    },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        },
        {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        }, {
            title: 'Cháo gà Cháo gà Cháo gà',
        },

    ];


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

}
