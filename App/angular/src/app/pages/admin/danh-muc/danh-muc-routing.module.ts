import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '@app/pages/admin/danh-muc/index.component';
const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        data: { permission: 'Pages.DanhMuc' },
        children: [
            {
                path: 'dia-chinh',
                loadChildren: () => import('./danh-muc-dia-chinh/danh-muc-dia-chinh.module').then(m => m.DanhMucDiaChinhModule), // Lazy load main module
                data: { preload: true },
            },

        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucRoutingModule {
}
