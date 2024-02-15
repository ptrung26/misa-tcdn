import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@shared/utils/utils.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { ChatDinhDuongComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/chat-dinh-duong/chat-dinh-duong.component';
import { CreateOrEditChatDinhDuongComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/chat-dinh-duong/create-or-edit.component';
import { NhomChatDinhDuongComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-chat-dinh-duong/nhom-chat-dinh-duong.component';
import { CreateOrEditNhomChatDinhDuongComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-chat-dinh-duong/create-or-edit.component';
import { NhomThucPhamComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-thuc-pham/nhom-thuc-pham.component';
import { CreateOrEditNhomThucPhamComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-thuc-pham/create-or-edit.component';
import { SharedModule } from '@shared/shared.module';
import { UpLoadDinhDuongModalComponent } from './chat-dinh-duong/up-load-dinh-duong-modal/up-load-dinh-duong-modal.component';
import { UpLoadNhomDinhDuongModalComponent } from './nhom-chat-dinh-duong/up-load-nhom-dinh-duong-modal/up-load-nhom-dinh-duong-modal.component';
import { UpLoadNhomThucPhamModalComponent } from './nhom-thuc-pham/up-load-nhom-thuc-pham-modal/up-load-nhom-thuc-pham-modal.component';
import { NhomMonAnComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-mon-an/nhom-mon-an.component';
import { CreateOrEditNhomMonAnComponent } from '@app/pages/admin/danh-muc/danh-muc-chuyen-mon/nhom-mon-an/create-or-edit.component';
import { UpLoadNhomMonAnModalComponent } from './nhom-mon-an/up-load-nhom-mon-an-modal/up-load-nhom-mon-an-modal.component';
import { QuanLyGiGlComponent } from './quan-ly-gi-gl/quan-ly-gi-gl.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        DataCommonModule,
        CustomizeCompModule,
        SharedModule,
    ],
    declarations: [
        ChatDinhDuongComponent, CreateOrEditChatDinhDuongComponent,
        NhomChatDinhDuongComponent, CreateOrEditNhomChatDinhDuongComponent,
        NhomThucPhamComponent, CreateOrEditNhomThucPhamComponent,
        UpLoadNhomThucPhamModalComponent,
        UpLoadNhomDinhDuongModalComponent,
        UpLoadDinhDuongModalComponent,
        NhomMonAnComponent, CreateOrEditNhomMonAnComponent, UpLoadNhomMonAnModalComponent, QuanLyGiGlComponent,
    ],

    providers: [],
})
export class DanhMucChuyenMonModule {
}
