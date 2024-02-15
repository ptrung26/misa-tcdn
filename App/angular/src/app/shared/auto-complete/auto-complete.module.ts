import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenThucPhamComponent } from './ten-thuc-pham/ten-thuc-pham.component';
import { FormsModule } from '@angular/forms';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { TenBenhNhanComponent } from './ten-benh-nhan/ten-benh-nhan.component';


@NgModule({
    declarations: [
        TenThucPhamComponent,
        TenBenhNhanComponent,
    ],
    exports: [
        TenThucPhamComponent,
        TenBenhNhanComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ...SHARED_ZORRO_MODULES,
    ],
})
export class AutoCompleteModule {
}
