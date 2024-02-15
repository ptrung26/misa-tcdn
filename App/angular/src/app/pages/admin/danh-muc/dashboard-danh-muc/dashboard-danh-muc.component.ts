import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutTabManagerService } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.service';
import { TabDataType } from '@app/shared/layout-tab/layout-tab-manager/TabDataType';
import { MenuConfig, OraMenu, OraMenuItem } from '@app/pages/admin/danh-muc/menu.config';
import { BehaviorSubject, combineLatest, Subject } from '@node_modules/rxjs';
import { FormControl } from '@node_modules/@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from '@node_modules/rxjs/internal/operators';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import * as _ from 'lodash';
import { PermissionCheckerService } from '@node_modules/abp-ng2-module';
import { CurrentTabOfSystemService } from '@app/shared/current-tab-of-system.service';

@Component({
    templateUrl: './dashboard-danh-muc.component.html',
    styleUrls: ['./dashboard-danh-muc.component.scss'],
})
export class DashboardDanhMucComponent implements OnInit, OnDestroy {
    menuSource: OraMenu[] = new MenuConfig().configs;
    filterContr = new FormControl();
    $filter = new BehaviorSubject('');
    $menuSource = this.$filter.pipe(
        map((filter) => {
            let source = _.cloneDeep(this.menuSource);
            source = source.map(item => {
                item.child = item.child.filter(x =>
                    (AppUtilityService.removeDau(x.title).indexOf(AppUtilityService.removeDau(filter).toLowerCase()) !== -1)
                    &&
                    (this._permissionCheckerService.isGranted(x.permission) || !x.permission),
                );
                return item;
            });
            const all = new OraMenu('Tất cả', '', '', _.flatMap(source, (x => x.child)));
            source.unshift(all);
            return source;
        }),
    );
    $indexItemSelected = new BehaviorSubject<number>(0);
    $menuItems = combineLatest([
        this.$indexItemSelected, this.$menuSource,
    ]).pipe(map(([index, source]) => {
        return source[index].child;
    }));
    $destroy = new Subject<boolean>();


    constructor(private layoutService: LayoutTabManagerService,
                private _permissionCheckerService: PermissionCheckerService,
                private currentTabSystem: CurrentTabOfSystemService,
    ) {
        this.currentTabSystem.$currentTabDanhMuc.pipe(takeUntil(this.$destroy), distinctUntilChanged())
            .subscribe(result => {
                this.layoutService.changeTab(result);
            });
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

    ngOnInit(): void {
        this.filterContr.valueChanges.pipe(debounceTime(200), takeUntil(this.$destroy)).subscribe(result => {
            this.$filter.next(result);
        });

        this.layoutService.$currentTabIndex.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100))
            .subscribe(result => {
                this.currentTabSystem.updateCurrentTabDanhMuc(result);
            });
    }


    getImgLink(src: any) {
        return src ? '/assets/common/icon/' + src : '/assets/common/icon/icon-danh-muc/no-tobacco-day.svg';
    }

    onClickMenu(menu: OraMenu, index: number) {
        this.$indexItemSelected.next(index);
    }

    addTab(dataItem: OraMenuItem) {
        this.layoutService.addTab(new TabDataType({
            title: dataItem.title,
            iconClass: '',
            key: dataItem.key,
        }));
    }


    addXa() {
        this.layoutService.addTab(new TabDataType({
            title: 'Danh mục xã',
            iconClass: '',
            key: 'dia-chinh/xa',
        }));
    }
}
