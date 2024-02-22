import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@node_modules/@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DanhMucRoutingModule } from '@app/pages/admin/danh-muc/danh-muc-routing.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SharedModule } from '@shared/shared.module';
import { XaComponent } from '@app/pages/admin/danh-muc/danh-muc-dia-chinh/xa/xa.component';
import { CreateOrEditXaComponent } from '@app/pages/admin/danh-muc/danh-muc-dia-chinh/xa/create-or-edit.component';
import { HuyenComponent } from './huyen/huyen.component';
import { CreateOrEditHuyenComponent } from './huyen/create-or-edit.component';
import { TinhComponent } from './tinh/tinh.component';
import { CreateOrEditTinhComponent } from './tinh/create-or-edit.component';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';

@NgModule({
    declarations: [
        TinhComponent,
        CreateOrEditTinhComponent,
        HuyenComponent,
        CreateOrEditHuyenComponent,
        XaComponent,
        CreateOrEditXaComponent,
    ],
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
        ...SHARED_ZORRO_MODULES,
    ],
})
export class DanhMucDiaChinhModule {}
