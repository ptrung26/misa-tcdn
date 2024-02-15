import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@shared/utils/utils.module';
import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';

import { SharedModule } from '@shared/shared.module';
import { IndexComponent } from './index.component';
import { LayoutTabManagerService } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.service';
import { LayoutTabModule } from '@app/shared/layout-tab/layout-tab.module';
import { OraMapModComService } from '@app/shared/layout-tab/ora-map-mod-com.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        DanhMucRoutingModule,
        DataCommonModule,
        CustomizeCompModule,
        SharedModule,
        LayoutTabModule,
    ],
    declarations: [
        IndexComponent],
    providers: [OraMapModComService, LayoutTabManagerService],
})
export class DanhMucModule {
}
