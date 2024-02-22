import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucTaiKhoanComponent } from './danh-muc-tai-khoan/danh-muc-tai-khoan.component';
const routes: Routes = [
    {
        path: 'dm_taikhoan',
        component: DanhMucTaiKhoanComponent,
        data: { permission: 'Pages.DanhMuc.TaiKhoan' },
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucRoutingModule {}
