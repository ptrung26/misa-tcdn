import { OraMapModComOutput } from '@app/shared/layout-tab/ora-map-mod-com.service';

export class MapConfig {
    public defaults: OraMapModComOutput[] = [
        {
            key: 'dia-chinh/tinh',
            module: import('./danh-muc-dia-chinh/danh-muc-dia-chinh.module').then(x => x.DanhMucDiaChinhModule),
            component: import('./danh-muc-dia-chinh/tinh/tinh.component').then(x => x.TinhComponent),
        },
        {
            key: 'dia-chinh/huyen',
            module: import('./danh-muc-dia-chinh/danh-muc-dia-chinh.module').then(x => x.DanhMucDiaChinhModule),
            component: import('./danh-muc-dia-chinh/huyen/huyen.component').then(x => x.HuyenComponent),
        },
        {
            key: 'dia-chinh/xa',
            module: import('./danh-muc-dia-chinh/danh-muc-dia-chinh.module').then(x => x.DanhMucDiaChinhModule),
            component: import('./danh-muc-dia-chinh/xa/xa.component').then(x => x.XaComponent),
        },
    ];

    public get configs(): OraMapModComOutput[] {
        return this.defaults;
    }
}
